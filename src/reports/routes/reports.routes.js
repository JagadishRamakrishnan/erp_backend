import express from 'express';
import reportsController from '../controller/reports.controller.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// Get Reports Data
router.get('/', authenticate, reportsController.getReports);
router.get('/export', authenticate, reportsController.export);

export default router;
