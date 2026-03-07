import customerService from '../service/customer.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class CustomerController {
  async create(req, res) {
    try {
      req.body.created_by = req.user.id;
      const customer = await customerService.createCustomer(req.body);
      return successResponse(res, customer, 'Customer created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const customers = await customerService.getAllCustomers();
      return successResponse(res, customers);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      if (!customer) return errorResponse(res, 'Customer not found', 404);
      return successResponse(res, customer);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const customer = await customerService.updateCustomer(req.params.id, req.body);
      if (!customer) return errorResponse(res, 'Customer not found', 404);
      return successResponse(res, customer, 'Customer updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await customerService.deleteCustomer(req.params.id);
      if (!result) return errorResponse(res, 'Customer not found', 404);
      return successResponse(res, null, 'Customer deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new CustomerController();
