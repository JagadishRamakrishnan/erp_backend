import { Op } from 'sequelize';
import Lead from '../../lead/models/lead.model.js';
import Customer from '../../customer/models/customer.model.js';
import Deal from '../../deal/models/deal.model.js';
import Task from '../../task/models/task.model.js';
import Activity from '../../activity/models/activity.model.js';
import Quotation from '../../quotation/models/quotation.model.js';
import Invoice from '../../invoice/models/invoice.model.js';
import Payment from '../../payment/models/payment.model.js';
import Ticket from '../../ticket/models/ticket.model.js';
import User from '../../user/models/user.model.js';

class DashboardService {
  async getDashboardStats(userId) {
    try {
      // Get counts
      const [
        totalLeads,
        totalCustomers,
        totalDeals,
        totalTasks,
        totalActivities,
        totalQuotations,
        totalInvoices,
        totalPayments,
        totalTickets,
        totalUsers
      ] = await Promise.all([
        Lead.count(),
        Customer.count(),
        Deal.count(),
        Task.count(),
        Activity.count(),
        Quotation.count(),
        Invoice.count(),
        Payment.count(),
        Ticket.count(),
        User.count()
      ]);

      // Get leads by status
      const leadsByStatus = await Lead.findAll({
        attributes: [
          'status',
          [Lead.sequelize.fn('COUNT', Lead.sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      // Get deals by stage
      const dealsByStage = await Deal.findAll({
        attributes: [
          'stage',
          [Deal.sequelize.fn('COUNT', Deal.sequelize.col('id')), 'count']
        ],
        group: ['stage']
      });

      // Get tasks by status
      const tasksByStatus = await Task.findAll({
        attributes: [
          'status',
          [Task.sequelize.fn('COUNT', Task.sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      // Get tickets by status
      const ticketsByStatus = await Ticket.findAll({
        attributes: [
          'status',
          [Ticket.sequelize.fn('COUNT', Ticket.sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      // Calculate revenue
      const totalRevenue = await Deal.sum('value', {
        where: { stage: 'Won' }
      }) || 0;

      const pendingRevenue = await Deal.sum('value', {
        where: { 
          stage: { 
            [Op.in]: ['Lead', 'Qualified', 'Proposal', 'Negotiation'] 
          } 
        }
      }) || 0;

      // Get invoice statistics
      const totalInvoiceAmount = await Invoice.sum('total_amount') || 0;
      const paidAmount = await Invoice.sum('paid_amount') || 0;
      const dueAmount = await Invoice.sum('due_amount') || 0;

      // Get payment statistics
      const totalPaymentAmount = await Payment.sum('amount') || 0;
      
      const paymentsByMethod = await Payment.findAll({
        attributes: [
          'payment_method',
          [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count'],
          [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'total']
        ],
        group: ['payment_method']
      });

      // Get recent deals (last 10)
      const recentDeals = await Deal.findAll({
        limit: 10,
        order: [['created_at', 'DESC']],
        include: [
          { 
            model: Customer, 
            as: 'customer',
            attributes: ['id', 'name', 'email']
          },
          { 
            model: User, 
            as: 'assignedTo',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      // Get recent activities (last 10)
      const recentActivities = await Activity.findAll({
        limit: 10,
        order: [['activity_date', 'DESC']],
        include: [
          { 
            model: User, 
            as: 'creator',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      // Get upcoming tasks (next 7 days)
      const upcomingTasks = await Task.findAll({
        where: {
          status: 'Pending',
          due_date: {
            [Op.between]: [new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
          }
        },
        order: [['due_date', 'ASC']],
        limit: 10,
        include: [
          { 
            model: User, 
            as: 'assignedTo',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      // Get overdue tasks
      const overdueTasks = await Task.count({
        where: {
          status: 'Pending',
          due_date: {
            [Op.lt]: new Date()
          }
        }
      });

      // Calculate conversion rates
      const wonDeals = await Deal.count({ where: { stage: 'Won' } });
      const lostDeals = await Deal.count({ where: { stage: 'Lost' } });
      const conversionRate = totalDeals > 0 ? ((wonDeals / totalDeals) * 100).toFixed(2) : 0;

      // Get top sales agents (by deal value)
      const topSalesAgents = await Deal.findAll({
        attributes: [
          'assigned_to',
          [Deal.sequelize.fn('COUNT', Deal.sequelize.col('Deal.id')), 'deal_count'],
          [Deal.sequelize.fn('SUM', Deal.sequelize.col('value')), 'total_value']
        ],
        where: { 
          stage: 'Won',
          assigned_to: { [Op.ne]: null }
        },
        group: ['assigned_to'],
        order: [[Deal.sequelize.literal('total_value'), 'DESC']],
        limit: 3,
        include: [
          { 
            model: User, 
            as: 'assignedTo',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      // Get quotation statistics
      const approvedQuotations = await Quotation.count({ where: { status: 'Approved' } });
      const pendingQuotations = await Quotation.count({ where: { status: 'Sent' } });
      const totalQuotationValue = await Quotation.sum('total_amount') || 0;

      return {
        // Overview counts
        overview: {
          totalLeads,
          totalCustomers,
          totalDeals,
          totalTasks,
          totalActivities,
          totalQuotations,
          totalInvoices,
          totalPayments,
          totalTickets,
          totalUsers
        },

        // Revenue statistics
        revenue: {
          totalRevenue,
          pendingRevenue,
          totalInvoiceAmount,
          paidAmount,
          dueAmount,
          totalPaymentAmount,
          conversionRate
        },

        // Breakdown by status/stage
        breakdown: {
          leadsByStatus: leadsByStatus.map(l => ({
            status: l.status,
            count: parseInt(l.dataValues.count)
          })),
          dealsByStage: dealsByStage.map(d => ({
            stage: d.stage,
            count: parseInt(d.dataValues.count)
          })),
          tasksByStatus: tasksByStatus.map(t => ({
            status: t.status,
            count: parseInt(t.dataValues.count)
          })),
          ticketsByStatus: ticketsByStatus.map(t => ({
            status: t.status,
            count: parseInt(t.dataValues.count)
          })),
          paymentsByMethod: paymentsByMethod.map(p => ({
            method: p.payment_method,
            count: parseInt(p.dataValues.count),
            total: parseFloat(p.dataValues.total)
          }))
        },

        // Quotation stats
        quotations: {
          total: totalQuotations,
          approved: approvedQuotations,
          pending: pendingQuotations,
          totalValue: totalQuotationValue
        },

        // Task stats
        tasks: {
          total: totalTasks,
          pending: tasksByStatus.find(t => t.status === 'Pending')?.dataValues.count || 0,
          completed: tasksByStatus.find(t => t.status === 'Completed')?.dataValues.count || 0,
          overdue: overdueTasks,
          upcoming: upcomingTasks.length
        },

        // Recent data
        recent: {
          deals: recentDeals,
          activities: recentActivities,
          upcomingTasks
        },

        // Deal statistics
        deals: {
          total: totalDeals,
          won: wonDeals,
          lost: lostDeals,
          conversionRate: parseFloat(conversionRate)
        },

        // Top sales agents
        topSalesAgents: topSalesAgents.map(agent => ({
          userId: agent.assigned_to,
          name: agent.assignedTo?.name || 'Unknown',
          email: agent.assignedTo?.email || '',
          dealCount: parseInt(agent.dataValues.deal_count),
          totalValue: parseFloat(agent.dataValues.total_value || 0)
        }))
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }
}

export default new DashboardService();
