import express from 'express';
const router = express.Router();
import activityController from '../controller/activity.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { createActivityDto, updateActivityDto } from '../dto/activity.dto.js';

router.post('/', authenticate, validate(createActivityDto), activityController.create);
router.get('/', authenticate, activityController.getAll);
router.get('/:id', authenticate, activityController.getById);
router.put('/:id', authenticate, validate(updateActivityDto), activityController.update);
router.delete('/:id', authenticate, activityController.delete);

export default router;
