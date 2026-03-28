import serviceCatalogService from '../service/service_catalog.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class ServiceCatalogController {
  async getAll(req, res) {
    try {
      const services = await serviceCatalogService.getAll(req.query);
      return successResponse(res, services);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const service = await serviceCatalogService.getById(req.params.id);
      if (!service) return errorResponse(res, 'Service not found', 404);
      return successResponse(res, service);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async create(req, res) {
    try {
      if (req.user.role !== 'Admin') return errorResponse(res, 'Unauthorized. Admin only.', 403);
      req.body.created_by = req.user.id;
      const service = await serviceCatalogService.create(req.body);
      return successResponse(res, service, 'Service created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      if (req.user.role !== 'Admin') return errorResponse(res, 'Unauthorized. Admin only.', 403);
      const service = await serviceCatalogService.update(req.params.id, req.body);
      if (!service) return errorResponse(res, 'Service not found', 404);
      return successResponse(res, service, 'Service updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      if (req.user.role !== 'Admin') return errorResponse(res, 'Unauthorized. Admin only.', 403);
      const result = await serviceCatalogService.delete(req.params.id);
      if (!result) return errorResponse(res, 'Service not found', 404);
      return successResponse(res, null, 'Service deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await serviceCatalogService.getCategories();
      return successResponse(res, categories);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new ServiceCatalogController();
