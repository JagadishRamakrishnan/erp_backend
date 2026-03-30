import express from 'express';
const router = express.Router();
import ticketController from '../controller/ticket.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createTicketDto, updateTicketDto } from '../dto/ticket.dto.js';
import { createTicketCommentDto } from '../dto/ticketComment.dto.js';

router.post('/', authenticate, validate(createTicketDto), ticketController.create);
router.get('/', authenticate, ticketController.getAll);
router.get('/:id', authenticate, ticketController.getById);
router.put('/:id', authenticate, validate(updateTicketDto), ticketController.update);
router.post('/:id/comments', authenticate, validate(createTicketCommentDto), ticketController.addComment);
router.delete('/:id', authenticate, ticketController.delete);

export default router;
