import Ticket from '../models/ticket.model.js';
import Customer from '../../customer/models/customer.model.js';
import User from '../../user/models/user.model.js';

class TicketService {
  async createTicket(ticketData) {
    const ticketNumber = `TKT-${Date.now()}`;
    return await Ticket.create({ ...ticketData, ticket_number: ticketNumber });
  }

  async getAllTickets(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.customer_id) where.customer_id = filters.customer_id;
    if (filters.assigned_to) where.assigned_to = filters.assigned_to;

    return await Ticket.findAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  async getTicketById(id) {
    return await Ticket.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  async updateTicket(id, ticketData) {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    return await ticket.update(ticketData);
  }

  async deleteTicket(id) {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return null;
    await ticket.destroy();
    return true;
  }
}

export default new TicketService();
