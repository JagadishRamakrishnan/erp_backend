import Quotation from '../models/quotation.model.js';
import QuotationItem from '../models/quotationItem.model.js';
import Customer from '../../customer/models/customer.model.js';
import Deal from '../../deal/models/deal.model.js';
import User from '../../user/models/user.model.js';

class QuotationService {
  async createQuotation(quotationData) {
    const quotationNumber = `QUO-${Date.now()}`;
    const { items, ...quotationInfo } = quotationData;
    
    const quotation = await Quotation.create({ 
      ...quotationInfo, 
      quotation_number: quotationNumber 
    });

    if (items && items.length > 0) {
      const quotationItems = items.map(item => ({
        ...item,
        quotation_id: quotation.id
      }));
      await QuotationItem.bulkCreate(quotationItems);
    }

    return await this.getQuotationById(quotation.id);
  }

  async getAllQuotations(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.customer_id) where.customer_id = filters.customer_id;

    return await Quotation.findAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name'] },
        { model: Deal, as: 'deal', attributes: ['id', 'deal_name'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: QuotationItem, as: 'items' }
      ]
    });
  }

  async getQuotationById(id) {
    return await Quotation.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name'] },
        { model: Deal, as: 'deal', attributes: ['id', 'deal_name'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: QuotationItem, as: 'items' }
      ]
    });
  }

  async updateQuotation(id, quotationData) {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) return null;
    return await quotation.update(quotationData);
  }

  async deleteQuotation(id) {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) return null;
    await QuotationItem.destroy({ where: { quotation_id: id } });
    await quotation.destroy();
    return true;
  }
}

export default new QuotationService();
