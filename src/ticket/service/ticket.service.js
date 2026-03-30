import Ticket from '../models/ticket.model.js';
import TicketComment from '../models/ticketComment.model.js';
import Customer from '../../customer/models/customer.model.js';
import User from '../../user/models/user.model.js';

class TicketService {
  async createTicket(ticketData) {
    const ticketNumber = `TKT-${Date.now()}`;
    
    // SLA Calculation
    const priorityHours = {
      'Low': 48,
      'Medium': 24,
      'High': 4,
      'Urgent': 1
    };
    const hours = priorityHours[ticketData.priority] || 24;
    const resolutionDueAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    return await Ticket.create({ 
      ...ticketData, 
      ticket_number: ticketNumber,
      resolution_due_at: resolutionDueAt
    });
  }

  async getAllTickets(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.customer_id) where.customer_id = filters.customer_id;
    if (filters.assigned_to) where.assigned_to = filters.assigned_to;

    return await Ticket.findAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name', 'email', 'phone'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'role'] }
      ]
    });
  }

  async getTicketById(id) {
    return await Ticket.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'customer_code', 'name', 'email', 'phone'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'role'] },
        { 
          model: TicketComment, 
          as: 'comments',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
        }
      ],
      order: [[{ model: TicketComment, as: 'comments' }, 'created_at', 'ASC']]
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

  async addComment(ticketId, commentData) {
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // Update first_response_at if this is the first non-customer comment
    if (!ticket.first_response_at) {
      await ticket.update({ first_response_at: new Date() });
    }

    if (commentData.status) {
      await ticket.update({ status: commentData.status });
      if (commentData.status === 'Closed') {
        await ticket.update({ resolved_at: new Date() });
      }
    }

    return await TicketComment.create({
      ticket_id: ticketId,
      user_id: commentData.user_id,
      comment: commentData.comment,
      is_internal: commentData.is_internal || false
    });
  }
}

export default new TicketService();
