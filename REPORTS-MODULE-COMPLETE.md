# Reports Module - Complete Implementation

## Overview
The Reports module provides comprehensive analytics and performance metrics for the CRM system.

## Backend Structure

### API Endpoint
- **GET /api/reports** - Get all reports data (requires authentication)

### Data Returned

```javascript
{
  kpiMetrics: {
    winRate: "68%",           // Percentage of won deals
    avgDealSize: "₹32.5K",    // Average value of won deals
    salesCycle: "28 days",    // Average days from creation to won
    activeLeads: "247"        // Count of active leads (New, Contacted, Qualified)
  },
  revenueTrend: [
    { name: "Jan", revenue: 45000 },
    { name: "Feb", revenue: 52000 },
    // ... last 6 months
  ],
  dealsTrend: [
    { name: "Jan", deals: 12 },
    { name: "Feb", deals: 15 },
    // ... last 6 months
  ],
  topPerformers: [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      dealsCount: 8,
      totalValue: 142000
    },
    // ... top 3 performers this month
  ]
}
```

## Frontend Implementation

### Reports Page (`/reports`)

Displays:
1. **KPI Cards** (4 metrics)
   - Win Rate: Percentage of deals won
   - Avg Deal Size: Average value of won deals
   - Sales Cycle: Average days to close
   - Active Leads: Current active leads count

2. **Revenue Trend Chart**
   - Line chart showing revenue over last 6 months
   - Based on payment records

3. **Deals Closed Chart**
   - Bar chart showing deals closed per month
   - Last 6 months of won deals

4. **Top Performers Table**
   - Top 3 sales performers this month
   - Shows name, deals closed, and total value
   - Ranked by total deal value

## Features

✅ Real-time KPI calculations
✅ 6-month revenue trend analysis
✅ 6-month deals closed tracking
✅ Top performers leaderboard (current month)
✅ Automatic data refresh on page load
✅ Loading states and error handling
✅ Responsive charts using Recharts
✅ Animated UI with Framer Motion

## Data Sources

- **Win Rate**: Calculated from deals table (Won vs Total)
- **Avg Deal Size**: Average value of won deals
- **Sales Cycle**: Average DATEDIFF between created_at and updated_at for won deals
- **Active Leads**: Count of leads with status New/Contacted/Qualified
- **Revenue Trend**: Sum of payments grouped by month
- **Deals Trend**: Count of won deals grouped by month
- **Top Performers**: Users ranked by total deal value this month

## Usage

1. Navigate to Reports page (`/reports`)
2. View real-time analytics and performance metrics
3. Charts automatically display last 6 months of data
4. Top performers show current month's best sales people

## Technical Details

### Backend Files
- `Backend/src/reports/service/reports.service.js` - Business logic
- `Backend/src/reports/controller/reports.controller.js` - Request handling
- `Backend/src/reports/routes/reports.routes.js` - Route definitions

### Frontend Files
- `frontend/src/services/reportsService.js` - API calls
- `frontend/src/pages/Reports.jsx` - UI component

### Database Queries
- Uses Sequelize ORM for data aggregation
- Raw SQL queries for complex calculations
- Optimized with proper date filtering
