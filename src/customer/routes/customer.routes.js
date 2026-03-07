import express from 'express';
const router = express.Router();
import customerController from '../controller/customer.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createCustomerDto, updateCustomerDto } from '../dto/customer.dto.js';

router.post('/', authenticate, validate(createCustomerDto), customerController.create);
router.get('/', authenticate, customerController.getAll);
router.get('/:id', authenticate, customerController.getById);
router.put('/:id', authenticate, validate(updateCustomerDto), customerController.update);
router.delete('/:id', authenticate, customerController.delete);

export default router;
