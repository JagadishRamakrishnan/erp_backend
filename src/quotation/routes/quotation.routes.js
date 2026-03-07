import express from 'express';
const router = express.Router();
import quotationController from '../controller/quotation.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createQuotationDto, updateQuotationDto } from '../dto/quotation.dto.js';

router.post('/', authenticate, validate(createQuotationDto), quotationController.create);
router.get('/', authenticate, quotationController.getAll);
router.get('/:id', authenticate, quotationController.getById);
router.put('/:id', authenticate, validate(updateQuotationDto), quotationController.update);
router.delete('/:id', authenticate, quotationController.delete);

export default router;
