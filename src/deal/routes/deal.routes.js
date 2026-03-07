import express from 'express';
const router = express.Router();
import dealController from '../controller/deal.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createDealDto, updateDealDto } from '../dto/deal.dto.js';

router.post('/', authenticate, validate(createDealDto), dealController.create);
router.get('/', authenticate, dealController.getAll);
router.get('/:id', authenticate, dealController.getById);
router.put('/:id', authenticate, validate(updateDealDto), dealController.update);
router.delete('/:id', authenticate, dealController.delete);

export default router;
