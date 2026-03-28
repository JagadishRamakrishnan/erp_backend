import Deal from '../models/deal.model.js';
import Customer from '../../customer/models/customer.model.js';
import Lead from '../../lead/models/lead.model.js';
import User from '../../user/models/user.model.js';
import ServiceCatalog from '../../service_catalog/models/service_catalog.model.js';

class DealService {
  async createDeal(dealData) {
    return await Deal.create(dealData);
  }

  async getAllDeals(filters = {}) {
    const where = {};
    if (filters.stage) where.stage = filters.stage;
    if (filters.assigned_to) where.assigned_to = filters.assigned_to;

    return await Deal.findAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name'] },
        { model: Lead, as: 'lead', attributes: ['id', 'lead_code', 'name'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: ServiceCatalog, as: 'service', attributes: ['id', 'name', 'category', 'unit_price'] }
      ]
    });
  }

  async getDealById(id) {
    return await Deal.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name'] },
        { model: Lead, as: 'lead', attributes: ['id', 'lead_code', 'name'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: ServiceCatalog, as: 'service', attributes: ['id', 'name', 'category', 'unit_price'] }
      ]
    });
  }

  async updateDeal(id, dealData) {
    const deal = await Deal.findByPk(id);
    if (!deal) return null;
    return await deal.update(dealData);
  }

  async deleteDeal(id) {
    const deal = await Deal.findByPk(id);
    if (!deal) return null;
    await deal.destroy();
    return true;
  }
}

export default new DealService();
