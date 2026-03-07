import express from 'express';
import dashboardController from '../controller/dashboard.controller.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticate, dashboardController.getDashboardStats);

export default router;
