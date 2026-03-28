import ServiceCatalog from '../models/service_catalog.model.js';
import ServiceLineItem from '../models/service_line_item.model.js';
import User from '../../user/models/user.model.js';
import db from '../../db/index.js';

class ServiceCatalogService {

  async getAll(filters = {}) {
    const where = {};
    if (filters.category) where.category = filters.category;
    if (filters.is_active !== undefined) where.is_active = filters.is_active === 'true';

    return await ServiceCatalog.findAll({
      where,
      include: [
        { model: ServiceLineItem, as: 'lineItems' },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async getById(id) {
    return await ServiceCatalog.findByPk(id, {
      include: [
        { model: ServiceLineItem, as: 'lineItems' },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] }
      ]
    });
  }

  async create(data) {
    const { line_items = [], ...serviceData } = data;

    const service = await ServiceCatalog.create(serviceData);

    if (line_items.length > 0) {
      const itemsWithServiceId = line_items.map(item => ({
        ...item,
        service_id: service.id
      }));
      await ServiceLineItem.bulkCreate(itemsWithServiceId);
    }

    return this.getById(service.id);
  }

  async update(id, data) {
    const { line_items, ...serviceData } = data;
    const service = await ServiceCatalog.findByPk(id);
    if (!service) return null;

    await service.update(serviceData);

    // Replace line items if provided
    if (line_items !== undefined) {
      await ServiceLineItem.destroy({ where: { service_id: id } });
      if (line_items.length > 0) {
        const itemsWithServiceId = line_items.map(item => ({
          ...item,
          service_id: id
        }));
        await ServiceLineItem.bulkCreate(itemsWithServiceId);
      }
    }

    return this.getById(id);
  }

  async delete(id) {
    const service = await ServiceCatalog.findByPk(id);
    if (!service) return null;
    await ServiceLineItem.destroy({ where: { service_id: id } });
    await service.destroy();
    return true;
  }

  async getCategories() {
    const categories = await ServiceCatalog.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('category')), 'category']],
      where: { is_active: true }
    });
    return categories.map(c => c.category).filter(Boolean);
  }
}

export default new ServiceCatalogService();
