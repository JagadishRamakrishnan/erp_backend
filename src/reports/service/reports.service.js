import db from '../../db/index.js';
import Deal from '../../deal/models/deal.model.js';
import Lead from '../../lead/models/lead.model.js';
import User from '../../user/models/user.model.js';
import Payment from '../../payment/models/payment.model.js';

class ReportsService {
  // Get comprehensive reports data
  async getReportsData() {
    // KPI Metrics
    const kpiMetrics = await this.getKPIMetrics();
    
    // Revenue Trend (last 6 months)
    const revenueTrend = await this.getRevenueTrend();
    
    // Deals Closed Trend (last 6 months)
    const dealsTrend = await this.getDealsTrend();
    
    // Top Performers
    const topPerformers = await this.getTopPerformers();

    return {
      kpiMetrics,
      revenueTrend,
      dealsTrend,
      topPerformers
    };
  }

  // Calculate KPI Metrics
  async getKPIMetrics() {
    // Win Rate
    const totalDeals = await Deal.count();
    const wonDeals = await Deal.count({ where: { stage: 'Closed Won' } });
    const winRate = totalDeals > 0 ? ((wonDeals / totalDeals) * 100).toFixed(0) : 0;

    // Average Deal Size
    const wonDealsData = await Deal.findAll({
      where: { stage: 'Closed Won' },
      attributes: ['value']
    });
    const totalValue = wonDealsData.reduce((sum, deal) => sum + parseFloat(deal.value || 0), 0);
    const avgDealSize = wonDeals > 0 ? (totalValue / wonDeals).toFixed(0) : 0;

    // Sales Cycle (average days from creation to won)
    const salesCycleResult = await db.sequelize.query(`
      SELECT AVG(DATEDIFF(updated_at, created_at)) as avg_days
      FROM deals
      WHERE stage = 'Closed Won'
    `, {
      type: db.Sequelize.QueryTypes.SELECT
    });
    const salesCycle = Math.round(salesCycleResult[0]?.avg_days || 28);

    // Active Leads
    const activeLeads = await Lead.count({
      where: {
        status: ['New', 'Contacted', 'Qualified']
      }
    });

    return {
      winRate: `${winRate}%`,
      avgDealSize: `₹${(avgDealSize / 1000).toFixed(1)}K`,
      salesCycle: `${salesCycle} days`,
      activeLeads: activeLeads.toString()
    };
  }

  // Get Revenue Trend (last 6 months)
  async getRevenueTrend() {
    const months = [];
    const currentDate = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        name: date.toLocaleString('en-US', { month: 'short' })
      });
    }

    const revenueTrend = [];
    
    for (const month of months) {
      const startDate = new Date(month.year, month.month - 1, 1);
      const endDate = new Date(month.year, month.month, 0, 23, 59, 59);

      const payments = await Payment.findAll({
        where: {
          payment_date: {
            [db.Sequelize.Op.between]: [startDate, endDate]
          }
        },
        attributes: ['amount']
      });

      const revenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
      
      revenueTrend.push({
        name: month.name,
        revenue: Math.round(revenue)
      });
    }

    return revenueTrend;
  }

  // Get Deals Closed Trend (last 6 months)
  async getDealsTrend() {
    const months = [];
    const currentDate = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        name: date.toLocaleString('en-US', { month: 'short' })
      });
    }

    const dealsTrend = [];
    
    for (const month of months) {
      const startDate = new Date(month.year, month.month - 1, 1);
      const endDate = new Date(month.year, month.month, 0, 23, 59, 59);

      const dealsCount = await Deal.count({
        where: {
          stage: 'Closed Won',
          updated_at: {
            [db.Sequelize.Op.between]: [startDate, endDate]
          }
        }
      });
      
      dealsTrend.push({
        name: month.name,
        deals: dealsCount
      });
    }

    return dealsTrend;
  }

  // Get Top Performers (this month)
  async getTopPerformers() {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

    const topPerformers = await db.sequelize.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(d.id) as deals_closed,
        SUM(d.value) as total_value
      FROM users u
      LEFT JOIN deals d ON u.id = d.assigned_to AND d.stage = 'Closed Won' 
        AND d.updated_at BETWEEN :startDate AND :endDate
      WHERE u.role IN ('Sales', 'Admin')
      GROUP BY u.id, u.name, u.email
      HAVING deals_closed > 0
      ORDER BY total_value DESC
      LIMIT 3
    `, {
      replacements: { startDate: startOfMonth, endDate: endOfMonth },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return topPerformers.map(performer => ({
      id: performer.id,
      name: performer.name,
      email: performer.email,
      dealsCount: parseInt(performer.deals_closed),
      totalValue: parseFloat(performer.total_value || 0)
    }));
  }
}

export default new ReportsService();
