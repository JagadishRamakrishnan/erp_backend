import invoiceService from '../service/invoice.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class InvoiceController {
  async create(req, res) {
    try {
      const invoice = await invoiceService.createInvoice(req.body);
      return successResponse(res, invoice, 'Invoice created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async createFromQuotation(req, res) {
    try {
      const { quotationId } = req.body;
      const invoice = await invoiceService.createFromQuotation(quotationId, req.user.id);
      return successResponse(res, invoice, 'Invoice generated from quotation', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const invoices = await invoiceService.getAllInvoices(req.query);
      return successResponse(res, invoices);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const invoice = await invoiceService.getInvoiceById(req.params.id);
      if (!invoice) return errorResponse(res, 'Invoice not found', 404);
      return successResponse(res, invoice);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
      if (!invoice) return errorResponse(res, 'Invoice not found', 404);
      return successResponse(res, invoice, 'Invoice updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await invoiceService.deleteInvoice(req.params.id);
      if (!result) return errorResponse(res, 'Invoice not found', 404);
      return successResponse(res, null, 'Invoice deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new InvoiceController();
