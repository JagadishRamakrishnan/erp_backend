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
    
    // Import Customer model
    const Customer = (await import('../../customer/models/customer.model.js')).default;
    
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
    
    // Update lead status to Won
    await lead.update({ status: 'Won' });
    
    return { lead, customer };
  }
}

export default new LeadService();
