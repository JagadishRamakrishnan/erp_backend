import express from 'express';
const router = express.Router();
import invoiceController from '../controller/invoice.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createInvoiceDto, updateInvoiceDto } from '../dto/invoice.dto.js';

router.post('/', authenticate, validate(createInvoiceDto), invoiceController.create);
router.post('/generate-from-quotation', authenticate, invoiceController.createFromQuotation);
router.get('/', authenticate, invoiceController.getAll);
router.get('/:id', authenticate, invoiceController.getById);
router.put('/:id', authenticate, validate(updateInvoiceDto), invoiceController.update);
router.delete('/:id', authenticate, invoiceController.delete);

export default router;
