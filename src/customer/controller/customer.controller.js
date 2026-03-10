import customerService from '../service/customer.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';
import { upload, parseFile, validateRequiredFields, processBulkResults } from '../../utils/bulkUpload.js';

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

  // Bulk Upload
  async bulkUpload(req, res) {
    try {
      if (!req.file) {
        return errorResponse(res, 'No file uploaded', 400);
      }

      const data = parseFile(req.file.path);
      
      if (data.length === 0) {
        return errorResponse(res, 'File is empty or invalid', 400);
      }

      // Validate required fields
      const requiredFields = ['name', 'email', 'phone'];
      const validationErrors = validateRequiredFields(data, requiredFields);
      
      if (validationErrors.length > 0) {
        return errorResponse(res, 'Validation failed', 400, validationErrors);
      }

      // Process each row
      const results = [];
      for (let i = 0; i < data.length; i++) {
        try {
          const customerData = {
            customer_code: `CUST-${Date.now()}-${i}`,
            name: data[i].name?.toString().trim(),
            email: data[i].email?.toString().trim(),
            phone: data[i].phone?.toString().trim(),
            company: data[i].company?.toString().trim() || null,
            address: data[i].address?.toString().trim() || null,
            city: data[i].city?.toString().trim() || null,
            state: data[i].state?.toString().trim() || null,
            country: data[i].country?.toString().trim() || null,
            postal_code: data[i].postal_code?.toString().trim() || null,
            created_by: req.user.id
          };

          const customer = await customerService.createCustomer(customerData);
          results.push({ success: true, data: customer });
        } catch (error) {
          results.push({ 
            success: false, 
            data: data[i], 
            error: error.message 
          });
        }
      }

      const summary = processBulkResults(results);
      return successResponse(res, summary, 'Bulk upload completed');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Download Template
  async downloadTemplate(req, res) {
    try {
      const csvHeaders = 'name,email,phone,company,address,city,state,country,postal_code\n';
      const csvData = [
        'John Smith,john@company.com,9876543210,Tech Corp,123 Main St,Mumbai,Maharashtra,India,400001',
        'Jane Doe,jane@business.com,9876543211,Business Ltd,456 Oak Ave,Delhi,Delhi,India,110001'
      ].join('\n');
      
      const csvContent = csvHeaders + csvData;

      res.setHeader('Content-Disposition', 'attachment; filename=customers_template.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Length', Buffer.byteLength(csvContent));
      
      res.send(csvContent);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new CustomerController();
