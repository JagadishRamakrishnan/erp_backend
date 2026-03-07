import express from 'express';
const router = express.Router();
import paymentController from '../controller/payment.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createPaymentDto, updatePaymentDto } from '../dto/payment.dto.js';

router.post('/', authenticate, validate(createPaymentDto), paymentController.create);
router.get('/', authenticate, paymentController.getAll);
router.get('/:id', authenticate, paymentController.getById);
router.put('/:id', authenticate, validate(updatePaymentDto), paymentController.update);
router.delete('/:id', authenticate, paymentController.delete);

export default router;
