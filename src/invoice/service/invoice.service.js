import Invoice from '../models/invoice.model.js';
import Payment from '../../payment/models/payment.model.js';
import Customer from '../../customer/models/customer.model.js';
import Deal from '../../deal/models/deal.model.js';
import Quotation from '../../quotation/models/quotation.model.js';

class InvoiceService {
  async createInvoice(invoiceData) {
    const invoiceNumber = `INV-${Date.now()}`;
    const dueAmount = invoiceData.total_amount - (invoiceData.paid_amount || 0);
    
    return await Invoice.create({ 
      ...invoiceData, 
      invoice_number: invoiceNumber,
      due_amount: dueAmount
    });
  }

  async getAllInvoices(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.customer_id) where.customer_id = filters.customer_id;

    return await Invoice.findAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name'] },
        { model: Deal, as: 'deal', attributes: ['id', 'deal_name'] },
        { model: Quotation, as: 'quotation', attributes: ['id', 'quotation_number'] },
        { model: Payment, as: 'payments' }
      ]
    });
  }

  async getInvoiceById(id) {
    return await Invoice.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name'] },
        { model: Deal, as: 'deal', attributes: ['id', 'deal_name'] },
        { model: Quotation, as: 'quotation', attributes: ['id', 'quotation_number'] },
        { model: Payment, as: 'payments' }
      ]
    });
  }

  async updateInvoice(id, invoiceData) {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return null;
    
    // Recalculate due amount if total_amount or paid_amount is being updated
    if (invoiceData.total_amount !== undefined || invoiceData.paid_amount !== undefined) {
      const totalAmount = invoiceData.total_amount !== undefined 
        ? invoiceData.total_amount 
        : invoice.total_amount;
      const paidAmount = invoiceData.paid_amount !== undefined 
        ? invoiceData.paid_amount 
        : invoice.paid_amount;
      
      invoiceData.due_amount = totalAmount - paidAmount;
    }
    
    return await invoice.update(invoiceData);
  }

  async deleteInvoice(id) {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return null;
    await invoice.destroy();
    return true;
  }

  async createFromQuotation(quotationId, createdBy) {
    const QuotationService = (await import('../../quotation/service/quotation.service.js')).default;
    const quotation = await QuotationService.getQuotationById(quotationId);
    if (!quotation) throw new Error('Quotation not found');

    const invoiceData = {
      customer_id: quotation.customer_id,
      deal_id: quotation.deal_id,
      quotation_id: quotation.id,
      total_amount: quotation.total_amount,
      tax_amount: quotation.tax_amount,
      status: 'Unpaid',
      paid_amount: 0,
      due_amount: quotation.total_amount,
      invoice_date: new Date(),
      due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Default 15 days
      created_by: createdBy
    };

    return await this.createInvoice(invoiceData);
  }
}

export default new InvoiceService();
