import express from 'express';
const router = express.Router();
import noteController from '../controller/note.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createNoteDto, updateNoteDto } from '../dto/note.dto.js';

router.post('/', authenticate, validate(createNoteDto), noteController.create);
router.get('/', authenticate, noteController.getAll);
router.get('/:id', authenticate, noteController.getById);
router.put('/:id', authenticate, validate(updateNoteDto), noteController.update);
router.delete('/:id', authenticate, noteController.delete);

export default router;
