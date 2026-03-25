import companyService from '../service/company.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class CompanyController {
  async getAll(req, res) {
    try {
      const companies = await companyService.getAll();
      return successResponse(res, companies);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const company = await companyService.getById(req.params.id);
      if (!company) return errorResponse(res, 'Company not found', 404);
      return successResponse(res, company);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async create(req, res) {
    try {
      req.body.created_by = req.user.id;
      const company = await companyService.create(req.body);
      return successResponse(res, company, 'Company created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const company = await companyService.update(req.params.id, req.body);
      if (!company) return errorResponse(res, 'Company not found', 404);
      return successResponse(res, company, 'Company updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await companyService.delete(req.params.id);
      if (!result) return errorResponse(res, 'Company not found', 404);
      return successResponse(res, null, 'Company deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async uploadLogo(req, res) {
    try {
      if (!req.file) return errorResponse(res, 'No file uploaded', 400);
      const logoUrl = `${req.protocol}://${req.get('host')}/uploads/logos/${req.file.filename}`;
      return successResponse(res, { logo_url: logoUrl }, 'Logo uploaded successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new CompanyController();
