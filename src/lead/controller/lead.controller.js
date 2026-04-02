import leadService from '../service/lead.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';
import { upload, parseFile, validateRequiredFields, processBulkResults, generateTemplate } from '../../utils/bulkUpload.js';
import XLSX from 'xlsx';

class LeadController {
  async create(req, res) {
    try {
      req.body.created_by = req.user.id;
      const lead = await leadService.createLead(req.body, req);
      return successResponse(res, lead, 'Lead created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const leads = await leadService.getAllLeads(req.query);
      return successResponse(res, leads);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const lead = await leadService.getLeadById(req.params.id);
      if (!lead) return errorResponse(res, 'Lead not found', 404);
      return successResponse(res, lead);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      if (req.body.internal_summary !== undefined) {
        req.body.summary_updated_at = new Date();
        req.body.summary_updated_by = req.user.id;
      }
      const lead = await leadService.updateLead(req.params.id, req.body, req);
      if (!lead) return errorResponse(res, 'Lead not found', 404);
      return successResponse(res, lead, 'Lead updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await leadService.deleteLead(req.params.id);
      if (!result) return errorResponse(res, 'Lead not found', 404);
      return successResponse(res, null, 'Lead deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async convertToCustomer(req, res) {
    try {
      const lead = await leadService.convertToCustomer(req.params.id);
      if (!lead) return errorResponse(res, 'Lead not found or already converted', 404);
      return successResponse(res, lead, 'Lead converted to customer successfully');
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

      console.log('File received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });

      const data = parseFile(req.file.path);
      
      console.log('Parsed data:', data.length, 'rows');
      
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
          const leadData = {
            lead_code: `LEAD-${Date.now()}-${i}`,
            name: data[i].name?.toString().trim(),
            email: data[i].email?.toString().trim(),
            phone: data[i].phone?.toString().trim(),
            company: data[i].company?.toString().trim() || null,
            source: data[i].source?.toString().trim() || 'Bulk Upload',
            status: data[i].status?.toString().trim() || 'New',
            assigned_to: (data[i].assigned_to || data[i]['assigned_to(optional)']) ? parseInt(data[i].assigned_to || data[i]['assigned_to(optional)']) : null,
            created_by: req.user.id
          };

          const lead = await leadService.createLead(leadData);
          results.push({ success: true, data: lead });
        } catch (error) {
          console.error('Error creating lead:', error);
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
      console.error('Bulk upload error:', error);
      return errorResponse(res, error.message);
    }
  }

  // Download Template
  async downloadTemplate(req, res) {
    try {
      // Create CSV content instead of Excel
      const csvHeaders = 'name,email,phone,company,source,status,assigned_to(optional)\n';
      const csvData = [
        'John Doe,john@example.com,9876543210,ABC Corp,Website,New,1',
        'Jane Smith,jane@example.com,9876543211,XYZ Ltd,Referral,Contacted,-'
      ].join('\n');
      
      const csvContent = csvHeaders + csvData;

      // Set headers for CSV download
      res.setHeader('Content-Disposition', 'attachment; filename=leads_template.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Length', Buffer.byteLength(csvContent));
      
      // Send CSV file
      res.send(csvContent);
    } catch (error) {
      console.error('Template generation error:', error);
      return errorResponse(res, error.message);
    }
  }
}

export default new LeadController();
