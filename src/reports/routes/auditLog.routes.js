import express from 'express';
import auditLogController from '../controller/auditLog.controller.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, auditLogController.getAll);

export default router;
