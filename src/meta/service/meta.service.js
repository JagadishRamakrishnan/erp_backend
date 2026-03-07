import MetaAccount from '../models/metaAccount.model.js';
import AdAccount from '../models/adAccount.model.js';
import Campaign from '../models/campaign.model.js';
import AdSet from '../models/adSet.model.js';
import Ad from '../models/ad.model.js';
import AdInsight from '../models/adInsight.model.js';
import MetaLead from '../models/metaLead.model.js';
import Lead from '../../lead/models/lead.model.js';
import db from '../../db/index.js';

class MetaService {
  // Connect Meta Account
  async connectMetaAccount(userId, metaData) {
    return await MetaAccount.create({
      user_id: userId,
      meta_user_id: metaData.meta_user_id,
      access_token: metaData.access_token,
      token_expiry: metaData.token_expiry
    });
  }

  // Get Meta Account by User
  async getMetaAccountByUser(userId) {
    return await MetaAccount.findOne({ where: { user_id: userId } });
  }

  // Sync Ad Accounts
  async syncAdAccounts(metaAccountId, adAccountsData) {
    const results = [];
    for (const account of adAccountsData) {
      const [adAccount] = await AdAccount.findOrCreate({
        where: { ad_account_id: account.ad_account_id },
        defaults: {
          meta_account_id: metaAccountId,
          ad_account_id: account.ad_account_id,
          name: account.name,
          currency: account.currency,
          timezone: account.timezone
        }
      });
      results.push(adAccount);
    }
    return results;
  }

  // Sync Campaigns
  async syncCampaigns(adAccountId, campaignsData) {
    const results = [];
    for (const camp of campaignsData) {
      const [campaign] = await Campaign.findOrCreate({
        where: { campaign_id: camp.campaign_id },
        defaults: {
          ad_account_id: adAccountId,
          campaign_id: camp.campaign_id,
          campaign_name: camp.campaign_name,
          objective: camp.objective,
          status: camp.status,
          daily_budget: camp.daily_budget,
          start_date: camp.start_date,
          end_date: camp.end_date
        }
      });
      
      // Update if exists
      if (!campaign._options.isNewRecord) {
        await campaign.update({
          campaign_name: camp.campaign_name,
          status: camp.status,
          daily_budget: camp.daily_budget
        });
      }
      
      results.push(campaign);
    }
    return results;
  }

  // Sync Ad Sets
  async syncAdSets(campaignId, adSetsData) {
    const results = [];
    for (const adset of adSetsData) {
      const [adSet] = await AdSet.findOrCreate({
        where: { adset_id: adset.adset_id },
        defaults: {
          campaign_id: campaignId,
          adset_id: adset.adset_id,
          adset_name: adset.adset_name,
          budget: adset.budget,
          status: adset.status
        }
      });
      
      if (!adSet._options.isNewRecord) {
        await adSet.update({
          adset_name: adset.adset_name,
          budget: adset.budget,
          status: adset.status
        });
      }
      
      results.push(adSet);
    }
    return results;
  }

  // Sync Ads
  async syncAds(adSetId, adsData) {
    const results = [];
    for (const adData of adsData) {
      const [ad] = await Ad.findOrCreate({
        where: { ad_id: adData.ad_id },
        defaults: {
          adset_id: adSetId,
          ad_id: adData.ad_id,
          ad_name: adData.ad_name,
          status: adData.status
        }
      });
      
      if (!ad._options.isNewRecord) {
        await ad.update({
          ad_name: adData.ad_name,
          status: adData.status
        });
      }
      
      results.push(ad);
    }
    return results;
  }

  // Sync Ad Insights
  async syncAdInsights(adId, insightsData) {
    const results = [];
    for (const insight of insightsData) {
      const ctr = insight.impressions > 0 ? (insight.clicks / insight.impressions * 100).toFixed(2) : 0;
      const cpc = insight.clicks > 0 ? (insight.spend / insight.clicks).toFixed(2) : 0;
      const cpl = insight.leads > 0 ? (insight.spend / insight.leads).toFixed(2) : 0;

      const [adInsight] = await AdInsight.findOrCreate({
        where: { ad_id: adId, date: insight.date },
        defaults: {
          ad_id: adId,
          date: insight.date,
          impressions: insight.impressions,
          clicks: insight.clicks,
          leads: insight.leads,
          spend: insight.spend,
          cpc,
          cpl,
          ctr
        }
      });
      
      if (!adInsight._options.isNewRecord) {
        await adInsight.update({
          impressions: insight.impressions,
          clicks: insight.clicks,
          leads: insight.leads,
          spend: insight.spend,
          cpc,
          cpl,
          ctr
        });
      }
      
      results.push(adInsight);
    }
    return results;
  }

  // Process Meta Lead Webhook
  async processMetaLead(leadData) {
    // Extract field data
    const fieldData = {};
    leadData.field_data.forEach(field => {
      fieldData[field.name] = field.values[0];
    });

    // Create Meta Lead
    const metaLead = await MetaLead.create({
      lead_id_meta: leadData.lead_id,
      campaign_id: leadData.campaign_id,
      adset_id: leadData.adset_id,
      ad_id: leadData.ad_id,
      name: fieldData.full_name || fieldData.name,
      email: fieldData.email,
      phone: fieldData.phone_number || fieldData.phone,
      form_id: leadData.form_id,
      created_time: new Date()
    });

    // Sync to CRM Leads
    const crmLead = await this.syncMetaLeadToCRM(metaLead);
    
    return { metaLead, crmLead };
  }

  // Sync Meta Lead to CRM
  async syncMetaLeadToCRM(metaLead) {
    if (metaLead.synced_to_crm) {
      return null;
    }

    const leadCode = `LEAD-META-${Date.now()}`;
    
    const crmLead = await Lead.create({
      lead_code: leadCode,
      name: metaLead.name,
      email: metaLead.email,
      phone: metaLead.phone,
      source: 'Meta Ads',
      status: 'New'
    });

    // Update meta lead
    await metaLead.update({
      synced_to_crm: true,
      crm_lead_id: crmLead.id
    });

    return crmLead;
  }

  // Get Dashboard Data
  async getDashboardData(userId) {
    const metaAccount = await MetaAccount.findOne({ where: { user_id: userId } });
    if (!metaAccount) {
      throw new Error('Meta account not connected');
    }

    // Get all campaigns
    const campaigns = await Campaign.findAll({
      include: [
        {
          model: AdAccount,
          as: 'adAccount',
          where: { meta_account_id: metaAccount.id }
        }
      ]
    });

    const campaignIds = campaigns.map(c => c.id);

    // Get total insights
    const insights = await db.sequelize.query(`
      SELECT 
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        SUM(leads) as total_leads,
        SUM(spend) as total_spend
      FROM ad_insights ai
      INNER JOIN ads a ON ai.ad_id = a.id
      INNER JOIN ad_sets ads ON a.adset_id = ads.id
      INNER JOIN campaigns c ON ads.campaign_id = c.id
      WHERE c.id IN (:campaignIds)
    `, {
      replacements: { campaignIds: campaignIds.length > 0 ? campaignIds : [0] },
      type: db.Sequelize.QueryTypes.SELECT
    });

    const stats = insights[0];
    const totalLeads = parseInt(stats.total_leads) || 0;
    const totalSpend = parseFloat(stats.total_spend) || 0;
    const costPerLead = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : 0;

    // Campaign performance
    const campaignPerformance = await db.sequelize.query(`
      SELECT 
        c.campaign_name,
        SUM(ai.leads) as leads,
        SUM(ai.spend) as spend,
        SUM(ai.clicks) as clicks,
        AVG(ai.ctr) as ctr,
        AVG(ai.cpl) as cpl
      FROM campaigns c
      INNER JOIN ad_sets ads ON c.id = ads.campaign_id
      INNER JOIN ads a ON ads.id = a.adset_id
      INNER JOIN ad_insights ai ON a.id = ai.ad_id
      WHERE c.id IN (:campaignIds)
      GROUP BY c.id, c.campaign_name
    `, {
      replacements: { campaignIds: campaignIds.length > 0 ? campaignIds : [0] },
      type: db.Sequelize.QueryTypes.SELECT
    });

    // Ads performance
    const adsPerformance = await db.sequelize.query(`
      SELECT 
        a.ad_name,
        c.campaign_name,
        SUM(ai.leads) as leads,
        SUM(ai.clicks) as clicks,
        SUM(ai.impressions) as impressions
      FROM ads a
      INNER JOIN ad_sets ads ON a.adset_id = ads.id
      INNER JOIN campaigns c ON ads.campaign_id = c.id
      INNER JOIN ad_insights ai ON a.id = ai.ad_id
      WHERE c.id IN (:campaignIds)
      GROUP BY a.id, a.ad_name, c.campaign_name
      ORDER BY leads DESC
      LIMIT 10
    `, {
      replacements: { campaignIds: campaignIds.length > 0 ? campaignIds : [0] },
      type: db.Sequelize.QueryTypes.SELECT
    });

    // Lead source analytics
    const leadSourceAnalytics = await db.sequelize.query(`
      SELECT 
        source,
        COUNT(*) as leads
      FROM leads
      GROUP BY source
    `, {
      type: db.Sequelize.QueryTypes.SELECT
    });

    return {
      summary: {
        totalCampaigns: campaigns.length,
        totalAdsRunning: await Ad.count({
          include: [{
            model: AdSet,
            as: 'adSet',
            include: [{
              model: Campaign,
              as: 'campaign',
              where: { id: campaignIds.length > 0 ? campaignIds : [0] }
            }]
          }],
          where: { status: 'Active' }
        }),
        totalLeadsFromAds: totalLeads,
        totalSpend: totalSpend,
        costPerLead: costPerLead
      },
      campaignPerformance,
      adsPerformance,
      leadSourceAnalytics
    };
  }

  // Get All Campaigns
  async getAllCampaigns(userId) {
    const metaAccount = await MetaAccount.findOne({ where: { user_id: userId } });
    if (!metaAccount) {
      throw new Error('Meta account not connected');
    }

    return await Campaign.findAll({
      include: [
        {
          model: AdAccount,
          as: 'adAccount',
          where: { meta_account_id: metaAccount.id }
        }
      ]
    });
  }
}

export default new MetaService();
