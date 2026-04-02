import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/csv' // alternative CSV mime type
  ];
  
  const allowedExtensions = ['.xlsx', '.xls', '.csv'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Only Excel (.xlsx, .xls) and CSV files are allowed. Received: ${file.mimetype}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Parse Excel/CSV file
export const parseFile = (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    console.log('Parsing file:', filePath);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    console.log('File extension:', ext);
    
    let data;
    
    if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
      // Use XLSX to parse everything - it handles CSV with commas/quotes correctly
      const fileBuffer = fs.readFileSync(filePath);
      
      let workbook;
      try {
        workbook = XLSX.read(fileBuffer, { type: 'buffer', raw: true });
      } catch (error) {
        console.error('XLSX parse error:', error);
        throw new Error(`Could not parse ${ext.substring(1).toUpperCase()} file. Please verify the format.`);
      }

      if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('No sheets found in the file');
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        blankrows: false
      });
      
      console.log(`${ext.substring(1).toUpperCase()} data parsed:`, data.length, 'rows');
    } else {
      throw new Error('Unsupported file format. Please use .xlsx, .xls, or .csv files');
    }
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    // Filter out empty rows
    data = data.filter(row => {
      return Object.values(row).some(value => value && value.toString().trim() !== '');
    });
    
    console.log('Final filtered data:', data.length, 'rows');
    console.log('Sample row:', data[0]);
    
    if (data.length === 0) {
      throw new Error('No valid data found in the file. Please make sure your file has data rows below the header.');
    }
    
    return data;
  } catch (error) {
    console.error('Parse file error:', error);
    // Clean up the uploaded file even if parsing fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

// Validate required fields
export const validateRequiredFields = (data, requiredFields) => {
  const errors = [];
  
  data.forEach((row, index) => {
    const missingFields = requiredFields.filter(field => !row[field] || row[field].toString().trim() === '');
    if (missingFields.length > 0) {
      errors.push(`Row ${index + 2}: Missing required fields: ${missingFields.join(', ')}`);
    }
  });
  
  return errors;
};

// Process bulk upload results
export const processBulkResults = (results) => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    successfulRecords: successful.map(r => r.data),
    failedRecords: failed.map(r => ({
      data: r.data,
      error: r.error
    }))
  };
};

// Generate demo template
export const generateTemplate = (fields, filename) => {
  const templateData = [{}];
  fields.forEach(field => {
    templateData[0][field.name] = field.example || '';
  });
  
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  
  const templatePath = `uploads/templates/${filename}`;
  const templateDir = path.dirname(templatePath);
  
  if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir, { recursive: true });
  }
  
  XLSX.writeFile(workbook, templatePath);
  return templatePath;
};