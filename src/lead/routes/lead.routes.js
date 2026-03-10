import express from 'express';
const router = express.Router();
import leadController from '../controller/lead.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createLeadDto, updateLeadDto } from '../dto/lead.dto.js';
import { upload } from '../../utils/bulkUpload.js';

router.post('/', authenticate, validate(createLeadDto), leadController.create);
router.get('/', authenticate, leadController.getAll);
router.get('/:id', authenticate, leadController.getById);
router.put('/:id', authenticate, validate(updateLeadDto), leadController.update);
router.delete('/:id', authenticate, leadController.delete);
router.post('/:id/convert', authenticate, leadController.convertToCustomer);

// Bulk Upload Routes
router.post('/bulk-upload', authenticate, upload.single('file'), leadController.bulkUpload);
router.get('/template/download', authenticate, leadController.downloadTemplate);

// Debug route to test file parsing
router.post('/debug-upload', authenticate, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.json({ error: 'No file uploaded' });
    }
    
    const fs = require('fs');
    const XLSX = require('xlsx');
    
    console.log('Debug - File info:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });
    
    // Try to read the file as buffer
    const fileBuffer = fs.readFileSync(req.file.path);
    console.log('Debug - Buffer length:', fileBuffer.length);
    
    // Try to parse with XLSX
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    console.log('Debug - Sheets:', workbook.SheetNames);
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log('Debug - Data:', data);
    
    // Clean up
    fs.unlinkSync(req.file.path);
    
    res.json({ 
      success: true, 
      sheets: workbook.SheetNames,
      data: data,
      dataLength: data.length
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.json({ error: error.message });
  }
});

export default router;
