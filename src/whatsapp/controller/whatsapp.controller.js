import whatsappService from '../service/whatsapp.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class WhatsAppController {
  async getCustomers(req, res) {
    try {
      const customers = await whatsappService.getCustomers();
      return successResponse(res, customers);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async sendCampaign(req, res) {
    try {
      const { customerIds, messageTemplate } = req.body;

      if (!customerIds || customerIds.length === 0) {
        return errorResponse(res, 'No customers selected', 400);
      }

      if (!messageTemplate) {
        return errorResponse(res, 'Template name is required', 400);
      }

      const result = await whatsappService.sendCampaign(customerIds, messageTemplate);
      return successResponse(res, result, `Campaign sent: ${result.sent} sent, ${result.failed} failed, ${result.skipped} skipped`);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new WhatsAppController();
