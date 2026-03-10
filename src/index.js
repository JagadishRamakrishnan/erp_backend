import express from 'express';

const router = express.Router();

// Import routes
import userRoutes from './user/routes/user.routes.js';
import leadRoutes from './lead/routes/lead.routes.js';
import customerRoutes from './customer/routes/customer.routes.js';
import dealRoutes from './deal/routes/deal.routes.js';
import taskRoutes from './task/routes/task.routes.js';
import activityRoutes from './activity/routes/activity.routes.js';
import quotationRoutes from './quotation/routes/quotation.routes.js';
import invoiceRoutes from './invoice/routes/invoice.routes.js';
import paymentRoutes from './payment/routes/payment.routes.js';
import ticketRoutes from './ticket/routes/ticket.routes.js';
import noteRoutes from './note/routes/note.routes.js';
import metaRoutes from './meta/routes/meta.routes.js';
import dashboardRoutes from './dashboard/routes/dashboard.routes.js';
import reportsRoutes from './reports/routes/reports.routes.js';

// Use routes
router.use('/users', userRoutes);
router.use('/leads', leadRoutes);
router.use('/customers', customerRoutes);
router.use('/deals', dealRoutes);
router.use('/tasks', taskRoutes);
router.use('/activities', activityRoutes);
router.use('/quotations', quotationRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);
router.use('/tickets', ticketRoutes);
router.use('/notes', noteRoutes);
router.use('/meta', metaRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportsRoutes);

export default router;
