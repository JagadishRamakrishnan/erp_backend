import fs from 'fs';
import path from 'path';

// Module configurations
const modules = [
  {
    name: 'customer',
    requiredFields: ['name', 'email', 'phone'],
    templateData: [
      {
        name: 'John Smith',
        email: 'john@company.com',
        phone: '9876543210',
        company: 'Tech Corp',
        address: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postal_code: '400001'
      },
      {
        name: 'Jane Doe',
        email: 'jane@business.com',
        phone: '9876543211',
        company: 'Business Ltd',
        address: '456 Oak Ave',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        postal_code: '110001'
      }
    ]
  },
  {
    name: 'deal',
    requiredFields: ['deal_name', 'customer_id', 'value'],
    templateData: [
      {
        deal_name: 'Website Development',
        customer_id: '1',
        value: '50000',
        stage: 'Lead',
        probability: '75',
        expected_close_date: '2024-12-31',
        assigned_to: '1'
      },
      {
        deal_name: 'Mobile App',
        customer_id: '2',
        value: '75000',
        stage: 'Qualified',
        probability: '60',
        expected_close_date: '2025-01-15',
        assigned_to: '2'
      }
    ]
  },
  {
    name: 'task',
    requiredFields: ['title', 'due_date'],
    templateData: [
      {
        title: 'Follow up call',
        description: 'Call customer about proposal',
        due_date: '2024-12-31',
        priority: 'High',
        status: 'Pending',
        assigned_to: '1',
        related_to: 'Lead',
        related_id: '1'
      },
      {
        title: 'Send quotation',
        description: 'Prepare and send quotation',
        due_date: '2024-12-25',
        priority: 'Medium',
        status: 'Pending',
        assigned_to: '2',
        related_to: 'Customer',
        related_id: '1'
      }
    ]
  },
  {
    name: 'activity',
    requiredFields: ['activity_type', 'subject', 'activity_date'],
    templateData: [
      {
        activity_type: 'Call',
        subject: 'Initial consultation',
        description: 'Discussed project requirements',
        activity_date: '2024-12-31 10:30:00',
        related_to: 'Lead',
        related_id: '1'
      },
      {
        activity_type: 'Email',
        subject: 'Proposal sent',
        description: 'Sent detailed proposal',
        activity_date: '2024-12-30 14:00:00',
        related_to: 'Customer',
        related_id: '1'
      }
    ]
  },
  {
    name: 'quotation',
    requiredFields: ['customer_id', 'quotation_date', 'total_amount'],
    templateData: [
      {
        customer_id: '1',
        deal_id: '1',
        quotation_date: '2024-12-31',
        valid_until: '2025-01-31',
        total_amount: '75000',
        terms: '30 days payment',
        status: 'Draft'
      },
      {
        customer_id: '2',
        deal_id: '2',
        quotation_date: '2024-12-30',
        valid_until: '2025-01-30',
        total_amount: '50000',
        terms: '15 days payment',
        status: 'Sent'
      }
    ]
  },
  {
    name: 'invoice',
    requiredFields: ['customer_id', 'invoice_date', 'total_amount'],
    templateData: [
      {
        customer_id: '1',
        deal_id: '1',
        quotation_id: '1',
        invoice_date: '2024-12-31',
        due_date: '2025-01-30',
        total_amount: '75000',
        paid_amount: '0',
        status: 'Pending'
      },
      {
        customer_id: '2',
        deal_id: '2',
        quotation_id: '2',
        invoice_date: '2024-12-30',
        due_date: '2025-01-29',
        total_amount: '50000',
        paid_amount: '25000',
        status: 'Partial'
      }
    ]
  },
  {
    name: 'payment',
    requiredFields: ['customer_id', 'amount', 'payment_date', 'payment_method'],
    templateData: [
      {
        customer_id: '1',
        invoice_id: '1',
        deal_id: '1',
        amount: '25000',
        payment_date: '2024-12-31',
        payment_method: 'Bank Transfer',
        reference_number: 'TXN123456',
        notes: 'Partial payment'
      },
      {
        customer_id: '2',
        invoice_id: '2',
        deal_id: '2',
        amount: '50000',
        payment_date: '2024-12-30',
        payment_method: 'UPI',
        reference_number: 'UPI789012',
        notes: 'Full payment'
      }
    ]
  },
  {
    name: 'ticket',
    requiredFields: ['title', 'customer_id', 'priority'],
    templateData: [
      {
        title: 'Login issue',
        description: 'Cannot access account',
        customer_id: '1',
        priority: 'High',
        status: 'Open',
        assigned_to: '1',
        category: 'Technical'
      },
      {
        title: 'Feature request',
        description: 'Need new reporting feature',
        customer_id: '2',
        priority: 'Medium',
        status: 'Open',
        assigned_to: '2',
        category: 'Enhancement'
      }
    ]
  },
  {
    name: 'note',
    requiredFields: ['title', 'content'],
    templateData: [
      {
        title: 'Meeting notes',
        content: 'Discussed project timeline and requirements',
        related_to: 'Customer',
        related_id: '1'
      },
      {
        title: 'Follow-up reminder',
        content: 'Need to call customer next week',
        related_to: 'Lead',
        related_id: '1'
      }
    ]
  }
];

// Function to add bulk upload methods to controller
const addBulkUploadToController = (moduleName, requiredFields, templateData) => {
  const controllerPath = `../src/${moduleName}/controller/${moduleName}.controller.js`;
  
  if (!fs.existsSync(controllerPath)) {
    console.log(`Controller not found: ${controllerPath}`);
    return;
  }

  let content = fs.readFileSync(controllerPath, 'utf8');
  
  // Add imports if not present
  if (!content.includes('upload, parseFile, validateRequiredFields, processBulkResults')) {
    content = content.replace(
      /import.*responseHelper.*\n/,
      `import { successResponse, errorResponse } from '../../../responseHelper.js';
import { upload, parseFile, validateRequiredFields, processBulkResults } from '../../utils/bulkUpload.js';
`
    );
  }

  // Generate CSV template data
  const csvHeaders = Object.keys(templateData[0]).join(',');
  const csvRows = templateData.map(row => Object.values(row).join(',')).join('\\n');

  // Add bulk upload methods before the closing brace
  const bulkUploadMethods = `
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
      const requiredFields = ${JSON.stringify(requiredFields)};
      const validationErrors = validateRequiredFields(data, requiredFields);
      
      if (validationErrors.length > 0) {
        return errorResponse(res, 'Validation failed', 400, validationErrors);
      }

      // Process each row
      const results = [];
      for (let i = 0; i < data.length; i++) {
        try {
          const ${moduleName}Data = {
            ${moduleName === 'customer' ? 'customer_code: `CUST-${Date.now()}-${i}`,' : ''}
            ${moduleName === 'deal' ? 'deal_code: `DEAL-${Date.now()}-${i}`,' : ''}
            ${moduleName === 'task' ? 'task_code: `TASK-${Date.now()}-${i}`,' : ''}
            ${moduleName === 'quotation' ? 'quotation_number: `QUOT-${Date.now()}-${i}`,' : ''}
            ${moduleName === 'invoice' ? 'invoice_number: `INV-${Date.now()}-${i}`,' : ''}
            ${moduleName === 'ticket' ? 'ticket_number: `TKT-${Date.now()}-${i}`,' : ''}
            ...Object.keys(data[i]).reduce((acc, key) => {
              acc[key] = data[i][key]?.toString().trim() || null;
              return acc;
            }, {}),
            ${moduleName === 'lead' || moduleName === 'activity' || moduleName === 'task' || moduleName === 'note' ? 'created_by: req.user.id' : ''}
          };

          const ${moduleName} = await ${moduleName}Service.create${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}(${moduleName}Data);
          results.push({ success: true, data: ${moduleName} });
        } catch (error) {
          console.error('Error creating ${moduleName}:', error);
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
      // Create CSV content
      const csvHeaders = '${csvHeaders}\\n';
      const csvData = '${csvRows}';
      
      const csvContent = csvHeaders + csvData;

      // Set headers for CSV download
      res.setHeader('Content-Disposition', 'attachment; filename=${moduleName}s_template.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Length', Buffer.byteLength(csvContent));
      
      // Send CSV file
      res.send(csvContent);
    } catch (error) {
      console.error('Template generation error:', error);
      return errorResponse(res, error.message);
    }
  }
`;

  // Add methods before the closing brace
  if (!content.includes('bulkUpload(req, res)')) {
    content = content.replace(/}\s*export default/, bulkUploadMethods + '\n}\n\nexport default');
  }

  fs.writeFileSync(controllerPath, content);
  console.log(`✅ Added bulk upload to ${moduleName} controller`);
};

// Function to add routes
const addBulkUploadRoutes = (moduleName) => {
  const routesPath = `../src/${moduleName}/routes/${moduleName}.routes.js`;
  
  if (!fs.existsSync(routesPath)) {
    console.log(`Routes not found: ${routesPath}`);
    return;
  }

  let content = fs.readFileSync(routesPath, 'utf8');
  
  // Add upload import if not present
  if (!content.includes('upload')) {
    content = content.replace(
      /import.*dto.*\n/,
      `import { create${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Dto, update${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Dto } from '../dto/${moduleName}.dto.js';
import { upload } from '../../utils/bulkUpload.js';
`
    );
  }

  // Add bulk upload routes before export
  const bulkUploadRoutes = `
// Bulk Upload Routes
router.post('/bulk-upload', authenticate, upload.single('file'), ${moduleName}Controller.bulkUpload);
router.get('/template/download', authenticate, ${moduleName}Controller.downloadTemplate);
`;

  if (!content.includes('bulk-upload')) {
    content = content.replace(/export default router;/, bulkUploadRoutes + '\nexport default router;');
  }

  fs.writeFileSync(routesPath, content);
  console.log(`✅ Added bulk upload routes to ${moduleName}`);
};

// Function to add service methods
const addBulkUploadToService = (moduleName) => {
  const servicePath = `../src/${moduleName}/service/${moduleName}.service.js`;
  
  if (!fs.existsSync(servicePath)) {
    console.log(`Service not found: ${servicePath}`);
    return;
  }

  let content = fs.readFileSync(servicePath, 'utf8');
  
  // Add bulkUpload method to service if not present
  if (!content.includes('bulkUpload')) {
    const bulkUploadMethod = `
  // Bulk upload method (if needed for custom logic)
  async bulkUpload(data) {
    const results = [];
    for (const item of data) {
      try {
        const result = await this.create${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}(item);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, data: item, error: error.message });
      }
    }
    return results;
  }
`;

    content = content.replace(/}\s*export default/, bulkUploadMethod + '\n}\n\nexport default');
    fs.writeFileSync(servicePath, content);
    console.log(`✅ Added bulk upload method to ${moduleName} service`);
  }
};

// Process all modules
console.log('🚀 Adding bulk upload functionality to all modules...\n');

modules.forEach(module => {
  console.log(`Processing ${module.name} module...`);
  addBulkUploadToController(module.name, module.requiredFields, module.templateData);
  addBulkUploadRoutes(module.name);
  addBulkUploadToService(module.name);
  console.log(`✅ Completed ${module.name} module\n`);
});

console.log('🎉 Bulk upload functionality added to all modules!');