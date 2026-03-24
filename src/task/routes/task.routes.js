import express from 'express';
const router = express.Router();
import taskController from '../controller/task.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createTaskDto, updateTaskDto } from '../dto/task.dto.js';

router.post('/', authenticate, validate(createTaskDto), taskController.create);
router.get('/', authenticate, taskController.getAll);
router.get('/tasks/today', authenticate, taskController.getTodayTasks);
router.get('/:id', authenticate, taskController.getById);
router.put('/:id', authenticate, validate(updateTaskDto), taskController.update);
router.delete('/:id', authenticate, taskController.delete);

export default router;
