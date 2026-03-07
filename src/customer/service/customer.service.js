import Customer from '../models/customer.model.js';
import User from '../../user/models/user.model.js';
import Lead from '../../lead/models/lead.model.js';

class CustomerService {
  async createCustomer(customerData) {
    const customerCode = `CUST-${Date.now()}`;
    return await Customer.create({ ...customerData, customer_code: customerCode });
  }

  async getAllCustomers() {
    return await Customer.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: Lead, as: 'lead', attributes: ['id', 'lead_code', 'name'] }
      ]
    });
  }

  async getCustomerById(id) {
    return await Customer.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: Lead, as: 'lead', attributes: ['id', 'lead_code', 'name'] }
      ]
    });
  }

  async updateCustomer(id, customerData) {
    const customer = await Customer.findByPk(id);
    if (!customer) return null;
    return await customer.update(customerData);
  }

  async deleteCustomer(id) {
    const customer = await Customer.findByPk(id);
    if (!customer) return null;
    await customer.destroy();
    return true;
  }
}

export default new CustomerService();
