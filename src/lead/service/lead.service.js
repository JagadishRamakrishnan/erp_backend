import Lead from '../models/lead.model.js';
import User from '../../user/models/user.model.js';
import ServiceCatalog from '../../service_catalog/models/service_catalog.model.js';
import ServiceLineItem from '../../service_catalog/models/service_line_item.model.js';

class LeadService {
  async createLead(leadData) {
    const { service_ids, ...data } = leadData;
    const leadCode = `LEAD-${Date.now()}`;
    const lead = await Lead.create({ ...data, lead_code: leadCode });
    
    if (service_ids && Array.isArray(service_ids)) {
      const ids = service_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      if (ids.length > 0) await lead.setInterestedServices(ids);
    }
    
    return await this.getLeadById(lead.id);
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

  async updateLead(id, leadData) {
    const { service_ids, ...data } = leadData;
    const lead = await Lead.findByPk(id);
    if (!lead) return null;
    
    await lead.update(data);
    
    if (service_ids !== undefined && Array.isArray(service_ids)) {
      const ids = service_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      await lead.setInterestedServices(ids);
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
