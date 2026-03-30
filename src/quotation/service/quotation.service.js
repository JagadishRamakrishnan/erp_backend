import Quotation from '../models/quotation.model.js';
import QuotationItem from '../models/quotationItem.model.js';
import Customer from '../../customer/models/customer.model.js';
import Deal from '../../deal/models/deal.model.js';
import Lead from '../../lead/models/lead.model.js';
import User from '../../user/models/user.model.js';
import Note from '../../note/models/note.model.js';
import Activity from '../../activity/models/activity.model.js';

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
    const quotation = await Quotation.findByPk(id, {
      include: [{ model: Customer, as: 'customer' }]
    });
    if (!quotation) return null;

    const oldStatus = quotation.status;
    const updated = await quotation.update(quotationData);

    // Automation: If status changes to Approved, handle Lead and Deal
    if (quotationData.status === 'Approved' && oldStatus !== 'Approved') {
      try {
        const customer = quotation.customer;
        if (customer && customer.created_from_lead) {
          const leadId = customer.created_from_lead;
          
          // 1. Mark Lead as Won
          await Lead.update({ status: 'Won' }, { where: { id: leadId } });

          // 2. Create Deal if it doesn't exist for this quotation
          if (!quotation.deal_id) {
            const deal = await Deal.create({
              deal_name: `Deal for ${customer.name} - ${quotation.quotation_number}`,
              customer_id: customer.id,
              lead_id: leadId,
              value: quotation.total_amount,
              stage: 'Won',
              probability: 100,
              assigned_to: quotation.created_by
            });

            // Link the deal back to the quotation
            await updated.update({ deal_id: deal.id });

            // 3. Create Note for Lead
            await Note.create({
              related_type: 'Lead',
              related_id: leadId,
              note: `Quotation Approved: ${quotation.quotation_number}. Auto-converted to Won.`,
              created_by: quotation.created_by
            });

            // 4. Create Activity for Lead
            await Activity.create({
              type: 'Stage Change',
              related_type: 'Lead',
              related_id: leadId,
              notes: `Quotation #${quotation.quotation_number} was approved. Lead moved to Won.`,
              activity_date: new Date().toISOString(),
              created_by: quotation.created_by
            });
          }
        }
      } catch (err) {
        console.error('Failed to automate lead/deal update on quote approval:', err);
      }
    }

    return await this.getQuotationById(id);
  }

  async deleteQuotation(id) {
    const quotation = await Quotation.findByPk(id);
    if (!quotation) return null;
    await QuotationItem.destroy({ where: { quotation_id: id } });
    await quotation.destroy();
    return true;
  }

  // Phase 2: Create a quotation pre-filled from a Service Catalog template
  async createFromService(serviceId, customerId, dealId, createdBy) {
    const ServiceCatalog = (await import('../../service_catalog/models/service_catalog.model.js')).default;
    const ServiceLineItem = (await import('../../service_catalog/models/service_line_item.model.js')).default;

    const service = await ServiceCatalog.findByPk(serviceId, {
      include: [{ model: ServiceLineItem, as: 'lineItems' }]
    });
    if (!service) throw new Error('Service not found');

    const items = service.lineItems && service.lineItems.length > 0
      ? service.lineItems.map(item => ({
          product_name: item.item_name,
          quantity: parseFloat(item.qty) || 1,
          price: parseFloat(item.unit_price) || 0,
          total: (parseFloat(item.qty) || 1) * (parseFloat(item.unit_price) || 0)
        }))
      : [{
          product_name: service.name,
          quantity: 1,
          price: parseFloat(service.unit_price) || 0,
          total: parseFloat(service.unit_price) || 0
        }];

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const taxAmount = (subtotal * (parseFloat(service.tax_percent) || 0)) / 100;
    const totalAmount = subtotal + taxAmount;

    return await this.createQuotation({
      customer_id: customerId,
      deal_id: dealId || null,
      total_amount: totalAmount,
      tax_amount: taxAmount,
      status: 'Draft',
      created_by: createdBy,
      items
    });
  }

  // Create a quotation from MULTIPLE service templates (merges all line items)
  async createFromMultipleServices(serviceIds, customerId, dealId, createdBy) {
    const ServiceCatalog = (await import('../../service_catalog/models/service_catalog.model.js')).default;
    const ServiceLineItem = (await import('../../service_catalog/models/service_line_item.model.js')).default;

    const services = await ServiceCatalog.findAll({
      where: { id: serviceIds },
      include: [{ model: ServiceLineItem, as: 'lineItems' }]
    });

    if (!services || services.length === 0) throw new Error('No services found');

    let allItems = [];
    let totalTax = 0;

    for (const service of services) {
      const lineItems = service.lineItems && service.lineItems.length > 0
        ? service.lineItems.map(item => ({
            product_name: item.item_name,
            description: service.name, // Add service name as description context
            quantity: parseFloat(item.qty) || 1,
            price: parseFloat(item.unit_price) || 0,
            tax_percent: parseFloat(service.tax_percent) || 0,
            total: (parseFloat(item.qty) || 1) * (parseFloat(item.unit_price) || 0)
          }))
        : [{
            product_name: service.name,
            quantity: 1,
            price: parseFloat(service.unit_price) || 0,
            tax_percent: parseFloat(service.tax_percent) || 0,
            total: parseFloat(service.unit_price) || 0
          }];

      allItems = [...allItems, ...lineItems];

      const serviceSub = lineItems.reduce((s, i) => s + i.total, 0);
      totalTax += (serviceSub * (parseFloat(service.tax_percent) || 0)) / 100;
    }

    const subtotal = allItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const totalAmount = subtotal + totalTax;

    return await this.createQuotation({
      customer_id: customerId,
      deal_id: dealId || null,
      total_amount: totalAmount,
      tax_amount: totalTax,
      status: 'Draft',
      created_by: createdBy,
      items: allItems
    });
  }
}

export default new QuotationService();
