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
}

export default new InvoiceService();
