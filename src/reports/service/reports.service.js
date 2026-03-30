import db from '../../db/index.js';
import Deal from '../../deal/models/deal.model.js';
import Lead from '../../lead/models/lead.model.js';
import User from '../../user/models/user.model.js';
import Payment from '../../payment/models/payment.model.js';
import Activity from '../../activity/models/activity.model.js';

class ReportsService {
  async getReportsData() {
    const [kpiMetrics, revenueTrend, dealsTrend, topPerformers, conversionFunnel, activityBreakdown, activityReport, leadSourceAnalysis, conversionAnalysis] = await Promise.all([
      this.getKPIMetrics(),
      this.getRevenueTrend(),
      this.getDealsTrend(),
      this.getTopPerformers(),
      this.getConversionFunnel(),
      this.getActivityBreakdown(),
      this.getActivityReport(),
      this.getLeadSourceAnalysis(),
      this.getConversionAnalysis(),
    ]);

    return { 
      kpiMetrics, revenueTrend, dealsTrend, topPerformers, 
      conversionFunnel, activityBreakdown, activityReport, 
      leadSourceAnalysis, conversionAnalysis 
    };
  }

  async getKPIMetrics() {
    const totalDeals = await Deal.count();
    const wonDeals = await Deal.count({ where: { stage: 'Closed Won' } });
    const winRate = totalDeals > 0 ? ((wonDeals / totalDeals) * 100).toFixed(0) : 0;

    const wonDealsData = await Deal.findAll({ where: { stage: 'Closed Won' }, attributes: ['value'] });
    const totalValue = wonDealsData.reduce((sum, deal) => sum + parseFloat(deal.value || 0), 0);
    const avgDealSize = wonDeals > 0 ? (totalValue / wonDeals).toFixed(0) : 0;

    const salesCycleResult = await db.sequelize.query(`
      SELECT AVG(DATEDIFF(updated_at, created_at)) as avg_days FROM deals WHERE stage = 'Closed Won'
    `, { type: db.Sequelize.QueryTypes.SELECT });
    const salesCycle = Math.round(salesCycleResult[0]?.avg_days || 0);

    const activeLeads = await Lead.count({ where: { status: ['New', 'Contacted', 'Qualified'] } });

    // Lead-to-Deal conversion rate
    const totalLeads = await Lead.count();
    const convertedLeads = await Lead.count({ where: { status: ['Won'] } });
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    return {
      winRate: `${winRate}%`,
      avgDealSize: `₹${(avgDealSize / 1000).toFixed(1)}K`,
      salesCycle: `${salesCycle} days`,
      activeLeads: activeLeads.toString(),
      conversionRate: `${conversionRate}%`,
      totalRevenue: `₹${(totalValue / 100000).toFixed(1)}L`,
    };
  }

  async getRevenueTrend() {
    const months = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({ month: date.getMonth() + 1, year: date.getFullYear(), name: date.toLocaleString('en-US', { month: 'short' }) });
    }

    const revenueTrend = [];
    for (const month of months) {
      const startDate = new Date(month.year, month.month - 1, 1);
      const endDate = new Date(month.year, month.month, 0, 23, 59, 59);
      const payments = await Payment.findAll({
        where: { payment_date: { [db.Sequelize.Op.between]: [startDate, endDate] } },
        attributes: ['amount']
      });
      const revenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      revenueTrend.push({ name: month.name, revenue: Math.round(revenue) });
    }
    return revenueTrend;
  }

  async getDealsTrend() {
    const months = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({ month: date.getMonth() + 1, year: date.getFullYear(), name: date.toLocaleString('en-US', { month: 'short' }) });
    }

    const dealsTrend = [];
    for (const month of months) {
      const startDate = new Date(month.year, month.month - 1, 1);
      const endDate = new Date(month.year, month.month, 0, 23, 59, 59);
      const [wonCount, lostCount, newCount] = await Promise.all([
        Deal.count({ where: { stage: 'Closed Won', updated_at: { [db.Sequelize.Op.between]: [startDate, endDate] } } }),
        Deal.count({ where: { stage: 'Closed Lost', updated_at: { [db.Sequelize.Op.between]: [startDate, endDate] } } }),
        Deal.count({ where: { created_at: { [db.Sequelize.Op.between]: [startDate, endDate] } } }),
      ]);
      dealsTrend.push({ name: month.name, won: wonCount, lost: lostCount, new: newCount });
    }
    return dealsTrend;
  }

  async getTopPerformers() {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

    const topPerformers = await db.sequelize.query(`
      SELECT u.id, u.name, u.email,
        COUNT(d.id) as deals_closed,
        IFNULL(SUM(d.value), 0) as total_value,
        (SELECT COUNT(*) FROM activities a WHERE a.created_by = u.id
          AND a.activity_date BETWEEN :startDate AND :endDate) as activity_count
      FROM users u
      LEFT JOIN deals d ON u.id = d.assigned_to AND d.stage = 'Closed Won'
        AND d.updated_at BETWEEN :startDate AND :endDate
      WHERE u.role IN ('Sales', 'Admin', 'Agent')
      GROUP BY u.id, u.name, u.email
      ORDER BY total_value DESC, activity_count DESC
      LIMIT 5
    `, { replacements: { startDate: startOfMonth, endDate: endOfMonth }, type: db.Sequelize.QueryTypes.SELECT });

    return topPerformers.map(p => ({
      id: p.id, name: p.name, email: p.email,
      dealsCount: parseInt(p.deals_closed || 0),
      totalValue: parseFloat(p.total_value || 0),
      activityCount: parseInt(p.activity_count || 0),
    }));
  }

  async getConversionFunnel() {
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
    const counts = await Promise.all(stages.map(s => Lead.count({ where: { status: s } })));
    return stages.map((stage, i) => ({ stage, count: counts[i] }));
  }

  async getActivityBreakdown() {
    const types = ['Call', 'Email', 'Meeting', 'WhatsApp', 'Note', 'Task'];
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const counts = await Promise.all(types.map(t =>
      Activity.count({ where: { type: t, activity_date: { [db.Sequelize.Op.gte]: startOfMonth } } })
    ));

    const totalActivities = counts.reduce((a, b) => a + b, 0);
    return types.map((type, i) => ({
      type, count: counts[i],
      pct: totalActivities > 0 ? ((counts[i] / totalActivities) * 100).toFixed(1) : 0
    }));
  }

  async getLeadSourceAnalysis() {
    const result = await db.sequelize.query(`
      SELECT source, COUNT(*) as total,
        SUM(CASE WHEN status = 'Won' THEN 1 ELSE 0 END) as won
      FROM leads
      WHERE source IS NOT NULL AND source != ''
      GROUP BY source
      ORDER BY total DESC
      LIMIT 8
    `, { type: db.Sequelize.QueryTypes.SELECT });

    return result.map(r => ({
      source: r.source,
      total: parseInt(r.total),
      won: parseInt(r.won),
      rate: r.total > 0 ? ((r.won / r.total) * 100).toFixed(0) : 0,
    }));
  }

  async getConversionAnalysis() {
    const result = await db.sequelize.query(`
      SELECT 
        AVG(DATEDIFF(l.updated_at, l.created_at)) as avg_convert_days,
        COUNT(l.id) as total_converted
      FROM leads l
      WHERE l.status = 'Won'
    `, { type: db.Sequelize.QueryTypes.SELECT });

    const velocity = await db.sequelize.query(`
      SELECT 
        DATE_FORMAT(updated_at, '%Y-%m') as month,
        COUNT(id) as count
      FROM leads
      WHERE status = 'Won'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `, { type: db.Sequelize.QueryTypes.SELECT });

    return {
      avgDaysToConvert: Math.round(result[0]?.avg_convert_days || 0),
      velocityTrend: velocity.map(v => ({ name: v.month, count: v.count }))
    };
  }

  async getActivityReport() {
    return await db.sequelize.query(`
      SELECT u.name, 
        COUNT(CASE WHEN a.type = 'Call' THEN 1 END) as calls,
        COUNT(CASE WHEN a.type = 'Email' THEN 1 END) as emails,
        COUNT(CASE WHEN a.type = 'Meeting' THEN 1 END) as meetings,
        COUNT(a.id) as total
      FROM users u
      LEFT JOIN activities a ON u.id = a.created_by
      WHERE u.role IN ('Sales', 'Admin', 'Agent')
      GROUP BY u.id, u.name
      ORDER BY total DESC
    `, { type: db.Sequelize.QueryTypes.SELECT });
  }

  async exportData(type) {
    let data = [];
    if (type === 'deals') {
      data = await Deal.findAll({ include: [{ model: User, as: 'assignedTo', attributes: ['name'] }] });
    } else if (type === 'leads') {
      data = await Lead.findAll();
    } else if (type === 'revenue') {
      data = await Payment.findAll();
    }

    if (data.length === 0) return "";
    
    // Convert Sequelize models to plain objects
    const plainData = data.map(item => item.get({ plain: true }));
    const keys = Object.keys(plainData[0]);
    
    const csv = [
      keys.join(','),
      ...plainData.map(row => keys.map(k => {
        const val = row[k];
        // Handle objects (like associations)
        const cell = typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val || '');
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    return csv;
  }
}

export default new ReportsService();
