import Lead from '../models/lead.model.js';
import LeadAssignmentRule from '../models/leadAssignmentRule.model.js';
import User from '../../user/models/user.model.js';
import { logAudit } from '../../auditHelper.js';
import ServiceCatalog from '../../service_catalog/models/service_catalog.model.js';
import ServiceLineItem from '../../service_catalog/models/service_line_item.model.js';
import ServiceActionPlan from '../../service_catalog/models/service_action_plan.model.js';
import Task from '../../task/models/task.model.js';

class LeadService {
  async createLead(leadData, req = null) {
    const { service_ids, ...data } = leadData;
    const leadCode = `LEAD-${Date.now()}`;
    
    // Auto Assignment
    let assignedTo = data.assigned_to;
    if (!assignedTo) {
      assignedTo = await this.autoAssign(leadData);
    }

    const lead = await Lead.create({ 
      ...data, 
      lead_code: leadCode,
      assigned_to: assignedTo || data.assigned_to
    });
    
    // Always include General Sales Process (ID: 2)
    const finalServiceIds = Array.isArray(service_ids) ? [...service_ids] : [];
    if (!finalServiceIds.includes(2)) {
      finalServiceIds.push(2);
    }

    if (finalServiceIds.length > 0) {
      const ids = finalServiceIds.map(id => parseInt(id)).filter(id => !isNaN(id));
      await lead.setInterestedServices(ids);
      
      // Automatically generate tasks based on Service Action Plans
      const actionPlans = await ServiceActionPlan.findAll({
        where: { service_id: ids }
      });
      
      if (actionPlans.length > 0) {
        const tasksToCreate = actionPlans.map(plan => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + plan.offset_days);
          
          return {
            title: plan.title,
            description: plan.description || 'Auto-generated from service action plan',
            status: 'Pending',
            priority: plan.priority || 'Medium',
            due_date: dueDate,
            assigned_to: lead.assigned_to,
            created_by: lead.created_by || lead.assigned_to,
            related_type: 'Lead',
            related_id: lead.id
          };
        });
        
        await Task.bulkCreate(tasksToCreate);
      }
    }
    
    if (req) await logAudit(req, 'CREATE', 'Lead', lead.id, { name: lead.name });
    
    return await this.getLeadById(lead.id);
  }

  async autoAssign(leadData) {
    const rules = await LeadAssignmentRule.findAll({
      where: { is_active: true }
    });

    // Manually sort rules by highest priority value in the array
    const sortedRules = rules.sort((a, b) => {
      const getP = (rule) => {
        try {
          const arr = JSON.parse(rule.priority);
          return Array.isArray(arr) ? Math.max(...arr, 0) : parseInt(rule.priority) || 0;
        } catch (e) { return parseInt(rule.priority) || 0; }
      };
      return getP(b) - getP(a);
    });

    for (const rule of sortedRules) {
      let values = [];
      try {
        values = (typeof rule.criteria_value === 'string' && rule.criteria_value.startsWith('[')) 
                 ? JSON.parse(rule.criteria_value) 
                 : [rule.criteria_value];
      } catch (e) { values = [rule.criteria_value]; }

      if (rule.criteria_field === 'source' && values.includes(leadData.source)) {
        return rule.assign_to;
      }
      if (rule.criteria_field === 'service') {
        const leadServices = Array.isArray(leadData.service_ids) ? leadData.service_ids.map(id => String(id)) : [];
        if (values.some(v => leadServices.includes(String(v)))) {
          return rule.assign_to;
        }
      }
    }
    return null;
  }

  async getAllLeads(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.assigned_to) where.assigned_to = filters.assigned_to;

    return await Lead.findAll({
      where,
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'summaryUpdatedBy', attributes: ['id', 'name', 'email'] },
        { model: ServiceCatalog, as: 'service', attributes: ['id', 'name', 'category', 'unit_price'] },
        { 
          model: ServiceCatalog, 
          as: 'interestedServices', 
          attributes: ['id', 'name', 'category', 'description', 'unit_price', 'tax_percent'],
          include: [{ model: ServiceLineItem, as: 'lineItems' }]
        }
      ]
    });
  }

  async getLeadById(id) {
    return await Lead.findByPk(id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'summaryUpdatedBy', attributes: ['id', 'name', 'email'] },
        { model: ServiceCatalog, as: 'service', attributes: ['id', 'name', 'category', 'unit_price'] },
        { 
          model: ServiceCatalog, 
          as: 'interestedServices', 
          attributes: ['id', 'name', 'category', 'description', 'unit_price', 'tax_percent'],
          include: [{ model: ServiceLineItem, as: 'lineItems' }]
        }
      ]
    });
  }

  async updateLead(id, leadData, req = null) {
    const { service_ids, ...data } = leadData;
    const lead = await Lead.findByPk(id);
    if (!lead) return null;
    
    const oldStatus = lead.status;
    await lead.update(data);
    
    if (service_ids !== undefined && Array.isArray(service_ids)) {
      const ids = service_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      await lead.setInterestedServices(ids);
    }

    if (req) {
      await logAudit(req, 'UPDATE', 'Lead', id, { 
        status: data.status, 
        changed: oldStatus !== data.status 
      });
    }
    
    return await this.getLeadById(id);
  }

  async deleteLead(id) {
    const lead = await Lead.findByPk(id);
    if (!lead) return null;
    await lead.destroy();
    return true;
  }

  async convertToCustomer(id) {
    const lead = await Lead.findByPk(id);
    if (!lead) return null;
    if (lead.status === 'Won') {
      return { alreadyConverted: true, lead };
    }
    
    // Import models
    const Customer = (await import('../../customer/models/customer.model.js')).default;
    const Deal = (await import('../../deal/models/deal.model.js')).default;
    
    // Generate customer code
    const customerCode = `CUST-${Date.now()}`;
    
    // Create customer from lead data
    const customer = await Customer.create({
      customer_code: customerCode,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      created_from_lead: lead.id,
      created_by: lead.created_by
    });

    // Automatically create a Deal for this won lead
    const deal = await Deal.create({
      deal_name: `${lead.name} - Initial Deal`,
      customer_id: customer.id,
      lead_id: lead.id,
      value: 0, // Default value, can be updated by sales rep
      probability: 100,
      stage: 'Closed Won',
      assigned_to: lead.assigned_to,
      source: lead.source,
      description: `Automatically created from lead conversion of ${lead.name}`
    });
    
    // Update lead status to Won
    await lead.update({ status: 'Won' });
    
    return { lead, customer, deal };
  }
}

export default new LeadService();
