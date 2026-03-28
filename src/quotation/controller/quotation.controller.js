import quotationService from '../service/quotation.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';
 import XLSX from "xlsx";
 
class QuotationController {
  async create(req, res) {
    try {
      req.body.created_by = req.user.id;
      const quotation = await quotationService.createQuotation(req.body);
      return successResponse(res, quotation, 'Quotation created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async createFromService(req, res) {
    try {
      const { serviceId, customerId, dealId } = req.body;
      const quotation = await quotationService.createFromService(serviceId, customerId, dealId, req.user.id);
      return successResponse(res, quotation, 'Quotation generated from service template', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const quotations = await quotationService.getAllQuotations(req.query);
      return successResponse(res, quotations);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const quotation = await quotationService.getQuotationById(req.params.id);
      if (!quotation) return errorResponse(res, 'Quotation not found', 404);
      return successResponse(res, quotation);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const quotation = await quotationService.updateQuotation(req.params.id, req.body);
      if (!quotation) return errorResponse(res, 'Quotation not found', 404);
      return successResponse(res, quotation, 'Quotation updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await quotationService.deleteQuotation(req.params.id);
      if (!result) return errorResponse(res, 'Quotation not found', 404);
      return successResponse(res, null, 'Quotation deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
 

async downloadTemplate(req, res) {
  try {
    const data = [
      {
        customer_id: "",
        deal_id: "",
        total_amount: "",
        tax_amount: "",
        status: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quotes");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=quotes_template.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    return errorResponse(res, "Failed to download template");
  }
}
}


export default new QuotationController();
