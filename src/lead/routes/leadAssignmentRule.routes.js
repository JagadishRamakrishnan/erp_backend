import express from 'express';
import leadAssignmentRuleController from '../controller/leadAssignmentRule.controller.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, leadAssignmentRuleController.getAll);
router.post('/', authenticate, leadAssignmentRuleController.create);
router.put('/:id', authenticate, leadAssignmentRuleController.update);
router.delete('/:id', authenticate, leadAssignmentRuleController.delete);

export default router;
