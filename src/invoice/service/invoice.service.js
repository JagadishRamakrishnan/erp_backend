import Invoice from '../models/invoice.model.js';
import InvoiceItem from '../models/invoiceItem.model.js';
import Payment from '../../payment/models/payment.model.js';
import Customer from '../../customer/models/customer.model.js';
import Deal from '../../deal/models/deal.model.js';
import Quotation from '../../quotation/models/quotation.model.js';
import QuotationItem from '../../quotation/models/quotationItem.model.js';

class InvoiceService {
  async createInvoice(invoiceData) {
    const invoiceNumber = `INV-${Date.now()}`;
    const { items, ...invoiceInfo } = invoiceData;
    const dueAmount = invoiceInfo.total_amount - (invoiceInfo.paid_amount || 0);
    
    const invoice = await Invoice.create({ 
      ...invoiceInfo, 
      invoice_number: invoiceNumber,
      due_amount: dueAmount
    });

    if (items && items.length > 0) {
      const invoiceItems = items.map(item => ({
        ...item,
        invoice_id: invoice.id
      }));
      await InvoiceItem.bulkCreate(invoiceItems);
    }

    return await this.getInvoiceById(invoice.id);
  }

  async getAllInvoices(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.customer_id) where.customer_id = filters.customer_id;

    return await Invoice.findAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name', 'email'] },
        { model: Deal, as: 'deal', attributes: ['id', 'deal_name'] },
        { model: Quotation, as: 'quotation', attributes: ['id', 'quotation_number'] },
        { model: Payment, as: 'payments' },
        { model: InvoiceItem, as: 'items' }
      ]
    });
  }

  async getInvoiceById(id) {
    return await Invoice.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name', 'email'] },
        { model: Deal, as: 'deal', attributes: ['id', 'deal_name'] },
        { model: Quotation, as: 'quotation', attributes: ['id', 'quotation_number'] },
        { model: Payment, as: 'payments' },
        { model: InvoiceItem, as: 'items' }
      ]
    });
  }

  async updateInvoice(id, invoiceData) {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return null;
    
    const { items, ...invoiceInfo } = invoiceData;

    // Recalculate due amount
    if (invoiceInfo.total_amount !== undefined || invoiceInfo.paid_amount !== undefined) {
      const totalAmount = invoiceInfo.total_amount !== undefined 
        ? invoiceInfo.total_amount 
        : invoice.total_amount;
      const paidAmount = invoiceInfo.paid_amount !== undefined 
        ? invoiceInfo.paid_amount 
        : invoice.paid_amount;
      
      invoiceInfo.due_amount = totalAmount - paidAmount;
    }
    
    await invoice.update(invoiceInfo);

    if (items) {
      // Sync items: delete old, create new (simple approach)
      await InvoiceItem.destroy({ where: { invoice_id: id } });
      if (items.length > 0) {
        const invoiceItems = items.map(item => ({
          ...item,
          invoice_id: id
        }));
        await InvoiceItem.bulkCreate(invoiceItems);
      }
    }
    
    return await this.getInvoiceById(id);
  }

  async deleteInvoice(id) {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return null;
    await invoice.destroy();
    return true;
  }

  async createFromQuotation(quotationId, createdBy) {
    // We need items from quotation as well
    const quotation = await Quotation.findByPk(quotationId, {
      include: [{ model: QuotationItem, as: 'items' }]
    });
    if (!quotation) throw new Error('Quotation not found');

    const invoiceData = {
      customer_id: quotation.customer_id,
      deal_id: quotation.deal_id,
      quotation_id: quotation.id,
      total_amount: quotation.total_amount,
      status: 'Pending',
      paid_amount: 0,
      due_amount: quotation.total_amount,
      created_by: createdBy,
      items: (quotation.items || []).map(item => ({
        description: item.product_name, // Map product_name to description for invoices
        quantity: item.quantity,
        unit_price: item.price,
        tax_percent: 0, // Fallback
        total: item.total
      }))
    };

    return await this.createInvoice(invoiceData);
  }

  async sendReminder(id) {
    const invoice = await this.getInvoiceById(id);
    if (!invoice) throw new Error('Invoice not found');
    
    // In a real system, you'd send an email/whatsapp here
    // For now, we'll timestamp it
    await invoice.update({ last_reminder_at: new Date() });
    return true;
  }
}

export default new InvoiceService();
