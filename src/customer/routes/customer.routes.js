import express from 'express';
const router = express.Router();
import customerController from '../controller/customer.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createCustomerDto, updateCustomerDto } from '../dto/customer.dto.js';
import { upload } from '../../utils/bulkUpload.js';

router.post('/', authenticate, validate(createCustomerDto), customerController.create);
router.get('/', authenticate, customerController.getAll);
router.get('/:id', authenticate, customerController.getById);
router.put('/:id', authenticate, validate(updateCustomerDto), customerController.update);
router.delete('/:id', authenticate, customerController.delete);

// Bulk Upload Routes
router.post('/bulk-upload', authenticate, upload.single('file'), customerController.bulkUpload);
router.get('/template/download', authenticate, customerController.downloadTemplate);

export default router;
