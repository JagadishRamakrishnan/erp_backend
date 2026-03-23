import express from 'express';
import whatsappController from '../controller/whatsapp.controller.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

router.get('/customers', authenticate, whatsappController.getCustomers);
router.post('/send', authenticate, whatsappController.sendCampaign);

export default router;
