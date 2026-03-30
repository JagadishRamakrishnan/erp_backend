import Lead from '../models/lead.model.js';
import LeadAssignmentRule from '../models/leadAssignmentRule.model.js';
import User from '../../user/models/user.model.js';
import { logAudit } from '../../auditHelper.js';
import ServiceCatalog from '../../service_catalog/models/service_catalog.model.js';
import ServiceLineItem from '../../service_catalog/models/service_line_item.model.js';

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
    
    if (service_ids && Array.isArray(service_ids)) {
      const ids = service_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      if (ids.length > 0) await lead.setInterestedServices(ids);
    }
    
    if (req) await logAudit(req, 'CREATE', 'Lead', lead.id, { name: lead.name });
    
    return await this.getLeadById(lead.id);
  }

  async autoAssign(leadData) {
    const rules = await LeadAssignmentRule.findAll({
      where: { is_active: true },
      order: [['priority', 'DESC']]
    });

    for (const rule of rules) {
      if (rule.criteria_field === 'source' && leadData.source === rule.criteria_value) {
        return rule.assign_to;
      }
      if (rule.criteria_field === 'service' && leadData.service_ids?.includes(parseInt(rule.criteria_value))) {
        return rule.assign_to;
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
