import express from 'express';
const router = express.Router();
import leadController from '../controller/lead.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createLeadDto, updateLeadDto } from '../dto/lead.dto.js';

router.post('/', authenticate, validate(createLeadDto), leadController.create);
router.get('/', authenticate, leadController.getAll);
router.get('/:id', authenticate, leadController.getById);
router.put('/:id', authenticate, validate(updateLeadDto), leadController.update);
router.delete('/:id', authenticate, leadController.delete);
router.post('/:id/convert', authenticate, leadController.convertToCustomer);

export default router;
