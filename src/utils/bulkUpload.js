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
    
    if (ext === '.csv') {
      // Handle CSV files - simple approach
      const fileContent = fs.readFileSync(filePath, 'utf8');
      console.log('CSV content preview:', fileContent.substring(0, 200));
      
      const lines = fileContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      console.log('CSV headers:', headers);
      
      data = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
      
    } else if (ext === '.xlsx' || ext === '.xls') {
      // Handle Excel files - try different approaches
      const fileBuffer = fs.readFileSync(filePath);
      console.log('Excel file buffer size:', fileBuffer.length);
      
      // Check if file is actually an Excel file by looking at the header
      const fileHeader = fileBuffer.toString('hex', 0, 8);
      console.log('File header (hex):', fileHeader);
      
      // Excel files should start with specific signatures
      const isXLSX = fileHeader.startsWith('504b0304') || fileHeader.startsWith('504b0506');
      const isXLS = fileHeader.startsWith('d0cf11e0');
      
      if (!isXLSX && !isXLS) {
        throw new Error('File does not appear to be a valid Excel file');
      }
      
      let workbook;
      try {
        // Try reading as buffer with minimal options
        workbook = XLSX.read(fileBuffer, { 
          type: 'buffer',
          raw: true
        });
      } catch (error) {
        console.log('Buffer read failed:', error.message);
        throw new Error('Could not parse Excel file. Please try saving as CSV format.');
      }
      
      if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('No sheets found in the Excel file');
      }
      
      console.log('Excel sheets found:', workbook.SheetNames);
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) {
        throw new Error('Could not read the worksheet');
      }
      
      // Convert to JSON with minimal options
      data = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        blankrows: false
      });
      
      console.log('Excel data parsed:', data.length, 'rows');
      
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