import Payment from '../models/payment.model.js';
import Invoice from '../../invoice/models/invoice.model.js';

class PaymentService {
  async createPayment(paymentData) {
    const payment = await Payment.create(paymentData);
    
    // Update invoice paid and due amounts
    const invoice = await Invoice.findByPk(paymentData.invoice_id);
    if (invoice) {
      const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(paymentData.amount);
      const newDueAmount = parseFloat(invoice.total_amount) - newPaidAmount;
      
      let status = 'Pending';
      if (newDueAmount <= 0) status = 'Paid';
      else if (newPaidAmount > 0) status = 'Partial';
      
      await invoice.update({
        paid_amount: newPaidAmount,
        due_amount: newDueAmount,
        status
      });
    }
    
    return payment;
  }

  async getAllPayments(filters = {}) {
    const where = {};
    if (filters.invoice_id) where.invoice_id = filters.invoice_id;
    if (filters.payment_method) where.payment_method = filters.payment_method;

    return await Payment.findAll({
      where,
      include: [
        { model: Invoice, as: 'invoice', attributes: ['id', 'invoice_number', 'total_amount'] }
      ]
    });
  }

  async getPaymentById(id) {
    return await Payment.findByPk(id, {
      include: [
        { model: Invoice, as: 'invoice', attributes: ['id', 'invoice_number', 'total_amount'] }
      ]
    });
  }

  async updatePayment(id, paymentData) {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;
    return await payment.update(paymentData);
  }

  async deletePayment(id) {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;
    await payment.destroy();
    return true;
  }
}

export default new PaymentService();
