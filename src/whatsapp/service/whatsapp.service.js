import Customer from '../../customer/models/customer.model.js';

class WhatsAppService {
  get PHONE_NUMBER_ID() { return process.env.WHATSAPP_PHONE_NUMBER_ID; }
  get ACCESS_TOKEN() { return process.env.META_ACCESS_TOKEN; }

  // Send a single WhatsApp template message
  async sendTemplateMessage(toPhone, templateName) {
    let phone = toPhone.replace(/\D/g, ''); // strip non-digits

    // Auto-prepend country code if 10-digit Indian number
    if (phone.length === 10) {
      phone = '91' + phone;
    }

    if (!this.PHONE_NUMBER_ID) {
      throw new Error('WHATSAPP_PHONE_NUMBER_ID is not set in .env');
    }

    const url = `https://graph.facebook.com/v18.0/${this.PHONE_NUMBER_ID}/messages`;

    const body = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' }
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data.error?.message || 'WhatsApp API error';
      const errCode = data.error?.code || '';
      console.error('[WhatsApp] Send failed:', JSON.stringify(data.error));
      throw new Error(`[${errCode}] ${errMsg}`);
    }

    return data;
  }

  // Get customers with phone numbers
  async getCustomers() {
    return await Customer.findAll({
      attributes: ['id', 'name', 'phone', 'email', 'company'],
      order: [['name', 'ASC']]
    });
  }

  // Send campaign to selected customers
  async sendCampaign(customerIds, templateName) {
    const customers = await Customer.findAll({
      where: { id: customerIds },
      attributes: ['id', 'name', 'phone']
    });

    const results = [];

    for (const customer of customers) {
      if (!customer.phone) {
        results.push({ id: customer.id, name: customer.name, status: 'skipped', reason: 'No phone number' });
        continue;
      }

      try {
        await this.sendTemplateMessage(customer.phone, templateName);
        results.push({ id: customer.id, name: customer.name, status: 'sent' });
      } catch (err) {
        results.push({ id: customer.id, name: customer.name, status: 'failed', reason: err.message });
      }
    }

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    return { sent, failed, skipped, results };
  }
}

export default new WhatsAppService();
