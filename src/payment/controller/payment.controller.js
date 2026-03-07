import paymentService from '../service/payment.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class PaymentController {
  async create(req, res) {
    try {
      const payment = await paymentService.createPayment(req.body);
      return successResponse(res, payment, 'Payment recorded successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const payments = await paymentService.getAllPayments(req.query);
      return successResponse(res, payments);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      if (!payment) return errorResponse(res, 'Payment not found', 404);
      return successResponse(res, payment);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const payment = await paymentService.updatePayment(req.params.id, req.body);
      if (!payment) return errorResponse(res, 'Payment not found', 404);
      return successResponse(res, payment, 'Payment updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await paymentService.deletePayment(req.params.id);
      if (!result) return errorResponse(res, 'Payment not found', 404);
      return successResponse(res, null, 'Payment deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new PaymentController();
