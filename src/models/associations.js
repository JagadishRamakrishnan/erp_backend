import User from '../user/models/user.model.js';
import Lead from '../lead/models/lead.model.js';
import Customer from '../customer/models/customer.model.js';
import Deal from '../deal/models/deal.model.js';
import Task from '../task/models/task.model.js';
import Activity from '../activity/models/activity.model.js';
import Quotation from '../quotation/models/quotation.model.js';
import QuotationItem from '../quotation/models/quotationItem.model.js';
import Invoice from '../invoice/models/invoice.model.js';
import Payment from '../payment/models/payment.model.js';
import Ticket from '../ticket/models/ticket.model.js';
import Note from '../note/models/note.model.js';
import Company from '../company/models/company.model.js';

// User associations
User.hasMany(Lead, { foreignKey: 'assigned_to', as: 'assignedLeads' });
User.hasMany(Lead, { foreignKey: 'created_by', as: 'createdLeads' });
User.hasMany(Lead, { foreignKey: 'summary_updated_by', as: 'summaryUpdatedLeads' });
User.hasMany(Customer, { foreignKey: 'created_by', as: 'createdCustomers' });
User.hasMany(Deal, { foreignKey: 'assigned_to', as: 'assignedDeals' });
User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
User.hasMany(Task, { foreignKey: 'created_by', as: 'createdTasks' });
User.hasMany(Activity, { foreignKey: 'created_by', as: 'activities' });
User.hasMany(Ticket, { foreignKey: 'assigned_to', as: 'assignedTickets' });
User.hasMany(Note, { foreignKey: 'created_by', as: 'notes' });

// Lead associations
Lead.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedTo' });
Lead.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Lead.belongsTo(User, { foreignKey: 'summary_updated_by', as: 'summaryUpdatedBy' });
Lead.hasMany(Customer, { foreignKey: 'created_from_lead', as: 'customers' });
Lead.hasMany(Deal, { foreignKey: 'lead_id', as: 'deals' });

// Customer associations
Customer.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Customer.belongsTo(Lead, { foreignKey: 'created_from_lead', as: 'lead' });
Customer.hasMany(Deal, { foreignKey: 'customer_id', as: 'deals' });
Customer.hasMany(Quotation, { foreignKey: 'customer_id', as: 'quotations' });
Customer.hasMany(Invoice, { foreignKey: 'customer_id', as: 'invoices' });
Customer.hasMany(Ticket, { foreignKey: 'customer_id', as: 'tickets' });

// Deal associations
Deal.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Deal.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });
Deal.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedTo' });
Deal.hasMany(Quotation, { foreignKey: 'deal_id', as: 'quotations' });
Deal.hasMany(Invoice, { foreignKey: 'deal_id', as: 'invoices' });

// Task associations
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedTo' });
Task.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Activity associations
Activity.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Quotation associations
Quotation.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Quotation.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });
Quotation.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Quotation.hasMany(QuotationItem, { foreignKey: 'quotation_id', as: 'items' });
Quotation.hasMany(Invoice, { foreignKey: 'quotation_id', as: 'invoices' });

// QuotationItem associations
QuotationItem.belongsTo(Quotation, { foreignKey: 'quotation_id', as: 'quotation' });

// Invoice associations
Invoice.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Invoice.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });
Invoice.belongsTo(Quotation, { foreignKey: 'quotation_id', as: 'quotation' });
Invoice.hasMany(Payment, { foreignKey: 'invoice_id', as: 'payments' });

// Payment associations
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoice' });

// Ticket associations
Ticket.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedTo' });

// Note associations
Note.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Company associations
Company.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Company, { foreignKey: 'created_by', as: 'companies' });

// Meta Ads Models
import MetaAccount from '../meta/models/metaAccount.model.js';
import AdAccount from '../meta/models/adAccount.model.js';
import Campaign from '../meta/models/campaign.model.js';
import AdSet from '../meta/models/adSet.model.js';
import Ad from '../meta/models/ad.model.js';
import AdInsight from '../meta/models/adInsight.model.js';
import MetaLead from '../meta/models/metaLead.model.js';

// Meta Account associations
User.hasMany(MetaAccount, { foreignKey: 'user_id', as: 'metaAccounts' });
MetaAccount.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Ad Account associations
MetaAccount.hasMany(AdAccount, { foreignKey: 'meta_account_id', as: 'adAccounts' });
AdAccount.belongsTo(MetaAccount, { foreignKey: 'meta_account_id', as: 'metaAccount' });

// Campaign associations
AdAccount.hasMany(Campaign, { foreignKey: 'ad_account_id', as: 'campaigns' });
Campaign.belongsTo(AdAccount, { foreignKey: 'ad_account_id', as: 'adAccount' });

// Ad Set associations
Campaign.hasMany(AdSet, { foreignKey: 'campaign_id', as: 'adSets' });
AdSet.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// Ad associations
AdSet.hasMany(Ad, { foreignKey: 'adset_id', as: 'ads' });
Ad.belongsTo(AdSet, { foreignKey: 'adset_id', as: 'adSet' });

// Ad Insight associations
Ad.hasMany(AdInsight, { foreignKey: 'ad_id', as: 'insights' });
AdInsight.belongsTo(Ad, { foreignKey: 'ad_id', as: 'ad' });

// Meta Lead associations
Campaign.hasMany(MetaLead, { foreignKey: 'campaign_id', as: 'metaLeads' });
MetaLead.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

AdSet.hasMany(MetaLead, { foreignKey: 'adset_id', as: 'metaLeads' });
MetaLead.belongsTo(AdSet, { foreignKey: 'adset_id', as: 'adSet' });

Ad.hasMany(MetaLead, { foreignKey: 'ad_id', as: 'metaLeads' });
MetaLead.belongsTo(Ad, { foreignKey: 'ad_id', as: 'ad' });

Lead.hasOne(MetaLead, { foreignKey: 'crm_lead_id', as: 'metaLead' });
MetaLead.belongsTo(Lead, { foreignKey: 'crm_lead_id', as: 'crmLead' });

export {
  User,
  Lead,
  Customer,
  Deal,
  Task,
  Activity,
  Quotation,
  QuotationItem,
  Invoice,
  Payment,
  Ticket,
  Note,
  Company,
  MetaAccount,
  AdAccount,
  Campaign,
  AdSet,
  Ad,
  AdInsight,
  MetaLead
};
