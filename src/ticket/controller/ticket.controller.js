import ticketService from '../service/ticket.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class TicketController {
  async create(req, res) {
    try {
      const ticket = await ticketService.createTicket(req.body);
      return successResponse(res, ticket, 'Ticket created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const tickets = await ticketService.getAllTickets(req.query);
      return successResponse(res, tickets);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const ticket = await ticketService.getTicketById(req.params.id);
      if (!ticket) return errorResponse(res, 'Ticket not found', 404);
      return successResponse(res, ticket);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const ticket = await ticketService.updateTicket(req.params.id, req.body);
      if (!ticket) return errorResponse(res, 'Ticket not found', 404);
      return successResponse(res, ticket, 'Ticket updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await ticketService.deleteTicket(req.params.id);
      if (!result) return errorResponse(res, 'Ticket not found', 404);
      return successResponse(res, null, 'Ticket deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new TicketController();
