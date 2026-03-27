import Lead from '../models/lead.model.js';
import User from '../../user/models/user.model.js';

class LeadService {
  async createLead(leadData) {
    const leadCode = `LEAD-${Date.now()}`;
    return await Lead.create({ ...leadData, lead_code: leadCode });
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
        { model: User, as: 'summaryUpdatedBy', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  async getLeadById(id) {
    return await Lead.findByPk(id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'summaryUpdatedBy', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  async updateLead(id, leadData) {
    const lead = await Lead.findByPk(id);
    if (!lead) return null;
    return await lead.update(leadData);
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
