import Company from '../models/company.model.js';
import User from '../../user/models/user.model.js';

class CompanyService {
  async getAll() {
    return await Company.findAll({
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async getById(id) {
    return await Company.findByPk(id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
    });
  }

  async create(data) {
    const company_code = `COMP-${Date.now()}`;
    return await Company.create({ ...data, company_code });
  }

  async update(id, data) {
    const company = await Company.findByPk(id);
    if (!company) return null;
    return await company.update(data);
  }

  async delete(id) {
    const company = await Company.findByPk(id);
    if (!company) return null;
    await company.destroy();
    return true;
  }
}

export default new CompanyService();
