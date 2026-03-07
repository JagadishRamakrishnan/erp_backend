import express from 'express';
const router = express.Router();
import ticketController from '../controller/ticket.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createTicketDto, updateTicketDto } from '../dto/ticket.dto.js';

router.post('/', authenticate, validate(createTicketDto), ticketController.create);
router.get('/', authenticate, ticketController.getAll);
router.get('/:id', authenticate, ticketController.getById);
router.put('/:id', authenticate, validate(updateTicketDto), ticketController.update);
router.delete('/:id', authenticate, ticketController.delete);

export default router;
