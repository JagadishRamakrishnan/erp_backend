import express from 'express';
const router = express.Router();
import quotationController from '../controller/quotation.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createQuotationDto, updateQuotationDto } from '../dto/quotation.dto.js';

router.post('/', authenticate, validate(createQuotationDto), quotationController.create);
router.post('/generate-from-template', authenticate, quotationController.createFromService);
router.get('/', authenticate, quotationController.getAll);
router.get('/template/download', quotationController.downloadTemplate);
router.get('/:id', authenticate, quotationController.getById);
router.put('/:id', authenticate, validate(updateQuotationDto), quotationController.update);
router.delete('/:id', authenticate, quotationController.delete);

export default router;
