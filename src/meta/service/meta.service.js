import MetaAccount from '../models/metaAccount.model.js';
import AdAccount from '../models/adAccount.model.js';
import Campaign from '../models/campaign.model.js';
import AdSet from '../models/adSet.model.js';
import Ad from '../models/ad.model.js';
import AdInsight from '../models/adInsight.model.js';
import MetaLead from '../models/metaLead.model.js';
import Lead from '../../lead/models/lead.model.js';
import db from '../../db/index.js';
import bizSdk from 'facebook-nodejs-business-sdk';

const { FacebookAdsApi, AdAccount: FBAdAccount } = bizSdk;

class MetaService {

  // Get credentials at runtime (not at module load time)
  get ACCESS_TOKEN() { return process.env.META_ACCESS_TOKEN; }
  get AD_ACCOUNT_ID() { return process.env.META_AD_ACCOUNT_ID; }
  get APP_ID() { return process.env.META_APP_ID; }

  // Initialize Facebook API
  initFbApi(token) {
    return FacebookAdsApi.init(token || this.ACCESS_TOKEN);
  }

  // ─── AUTO-CONNECT using env credentials ───────────────────────────────────
  async autoConnect(userId) {
    const accessToken = this.ACCESS_TOKEN;
    const adAccountId = this.AD_ACCOUNT_ID;
    const appId = this.APP_ID;

    if (!adAccountId) {
      throw new Error('META_AD_ACCOUNT_ID is not set in environment variables');
    }

    let metaAccount = await MetaAccount.findOne({ where: { user_id: userId } });
    if (!metaAccount) {
      metaAccount = await MetaAccount.create({
        user_id: userId,
        meta_user_id: appId,
        access_token: accessToken,
        token_expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      });
    } else {
      // Always update token from env in case it changed
      await metaAccount.update({ access_token: accessToken });
    }

    // Ensure ad account row exists
    let adAccount = await AdAccount.findOne({ where: { meta_account_id: metaAccount.id } });
    if (!adAccount) {
      adAccount = await AdAccount.create({
        meta_account_id: metaAccount.id,
        ad_account_id: adAccountId,
        name: 'My Ad Account',
        currency: 'INR',
        timezone: 'Asia/Kolkata'
      });
    } else if (adAccount.ad_account_id !== adAccountId) {
      await adAccount.update({ ad_account_id: adAccountId });
    }

    return { metaAccount, adAccount };
  }

  // ─── SYNC REAL DATA FROM FACEBOOK ─────────────────────────────────────────
  async syncFromFacebook(userId) {
    const { metaAccount, adAccount } = await this.autoConnect(userId);

    this.initFbApi(metaAccount.access_token);

    // 1. Fetch campaigns from Facebook
    const fbAccount = new FBAdAccount(adAccount.ad_account_id);
    const fbCampaigns = await fbAccount.getCampaigns(
      ['id', 'name', 'objective', 'status', 'daily_budget', 'start_time', 'stop_time'],
      { limit: 100 }
    );

    const syncedCampaigns = [];

    for (const fbCamp of fbCampaigns) {
      const [campaign, created] = await Campaign.findOrCreate({
        where: { campaign_id: fbCamp.id },
        defaults: {
          ad_account_id: adAccount.id,
          campaign_id: fbCamp.id,
          campaign_name: fbCamp.name,
          objective: fbCamp.objective,
          status: fbCamp.status,
          daily_budget: fbCamp.daily_budget ? fbCamp.daily_budget / 100 : null,
          start_date: fbCamp.start_time || null,
          end_date: fbCamp.stop_time || null
        }
      });

      if (!created) {
        await campaign.update({
          campaign_name: fbCamp.name,
          status: fbCamp.status,
          daily_budget: fbCamp.daily_budget ? fbCamp.daily_budget / 100 : null
        });
      }

      // 2. Fetch ad sets for each campaign
      try {
        const fbAdSets = await fbCamp.getAdSets(
          ['id', 'name', 'status', 'daily_budget'],
          { limit: 100 }
        );

        for (const fbAdSet of fbAdSets) {
          const [adSet, adSetCreated] = await AdSet.findOrCreate({
            where: { adset_id: fbAdSet.id },
            defaults: {
              campaign_id: campaign.id,
              adset_id: fbAdSet.id,
              adset_name: fbAdSet.name,
              budget: fbAdSet.daily_budget ? fbAdSet.daily_budget / 100 : null,
              status: fbAdSet.status
            }
          });

          if (!adSetCreated) {
            await adSet.update({ adset_name: fbAdSet.name, status: fbAdSet.status });
          }

          // 3. Fetch ads for each ad set
          try {
            const fbAds = await fbAdSet.getAds(
              ['id', 'name', 'status'],
              { limit: 100 }
            );

            for (const fbAd of fbAds) {
              const [ad, adCreated] = await Ad.findOrCreate({
                where: { ad_id: fbAd.id },
                defaults: {
                  adset_id: adSet.id,
                  ad_id: fbAd.id,
                  ad_name: fbAd.name,
                  status: fbAd.status
                }
              });

              if (!adCreated) {
                await ad.update({ ad_name: fbAd.name, status: fbAd.status });
              }

              // 4. Fetch insights for each ad
              try {
                const fbInsights = await fbAd.getInsights(
                  ['impressions', 'clicks', 'spend', 'ctr', 'cpc', 'actions'],
                  { date_preset: 'last_30d', limit: 30 }
                );

                for (const insight of fbInsights) {
                  const leads = insight.actions
                    ? (insight.actions.find(a => a.action_type === 'lead')?.value || 0)
                    : 0;
                  const spend = parseFloat(insight.spend || 0);
                  const clicks = parseInt(insight.clicks || 0);
                  const impressions = parseInt(insight.impressions || 0);
                  const ctr = parseFloat(insight.ctr || 0);
                  const cpc = parseFloat(insight.cpc || 0);
                  const cpl = leads > 0 ? (spend / leads).toFixed(2) : 0;
                  const date = insight.date_start || new Date().toISOString().split('T')[0];

                  const [adInsight, insightCreated] = await AdInsight.findOrCreate({
                    where: { ad_id: ad.id, date },
                    defaults: { ad_id: ad.id, date, impressions, clicks, leads, spend, ctr, cpc, cpl }
                  });

                  if (!insightCreated) {
                    await adInsight.update({ impressions, clicks, leads, spend, ctr, cpc, cpl });
                  }
                }
              } catch (e) {
                // insights may not be available for all ads
              }
            }
          } catch (e) {
            // ads may not be available for all ad sets
          }
        }
      } catch (e) {
        // ad sets may not be available for all campaigns
      }

      syncedCampaigns.push(campaign);
    }

    return { synced: syncedCampaigns.length, campaigns: syncedCampaigns };
  }

  // ─── CONNECT META ACCOUNT (manual) ────────────────────────────────────────
  async connectMetaAccount(userId, metaData) {
    const existing = await MetaAccount.findOne({ where: { user_id: userId } });
    if (existing) {
      await existing.update({
        access_token: metaData.access_token || this.ACCESS_TOKEN,
        meta_user_id: metaData.meta_user_id || this.APP_ID,
        token_expiry: metaData.token_expiry || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      });
      return existing;
    }
    return await MetaAccount.create({
      user_id: userId,
      meta_user_id: metaData.meta_user_id || this.APP_ID,
      access_token: metaData.access_token || this.ACCESS_TOKEN,
      token_expiry: metaData.token_expiry || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    });
  }

  // ─── GET META ACCOUNT ──────────────────────────────────────────────────────
  async getMetaAccountByUser(userId) {
    return await MetaAccount.findOne({ where: { user_id: userId } });
  }

  // ─── CREATE CAMPAIGN ON FACEBOOK ──────────────────────────────────────────
  async createFacebookCampaign(userId, campaignData) {
    const { metaAccount, adAccount } = await this.autoConnect(userId);
    this.initFbApi(metaAccount.access_token);

    const fields = [];
    const params = {
      name: campaignData.campaign_name,
      objective: campaignData.objective || 'OUTCOME_TRAFFIC',
      status: campaignData.status || 'PAUSED',
      special_ad_categories: campaignData.special_ad_categories || []
    };

    if (campaignData.daily_budget) {
      params.daily_budget = campaignData.daily_budget * 100; // Facebook uses cents
    }

    const fbCampaign = await (new FBAdAccount(adAccount.ad_account_id)).createCampaign(fields, params);
    const campaign = await Campaign.create({
      ad_account_id: adAccount.id,
      campaign_id: fbCampaign.id,
      campaign_name: campaignData.campaign_name,
      objective: campaignData.objective || 'OUTCOME_TRAFFIC',
      status: campaignData.status || 'PAUSED',
      daily_budget: campaignData.daily_budget || null,
      start_date: campaignData.start_date || null,
      end_date: campaignData.end_date || null
    });

    return { facebook_campaign_id: fbCampaign.id, campaign };
  }

  // ─── GET DASHBOARD DATA ────────────────────────────────────────────────────
  async getDashboardData(userId) {
    // Auto-connect if not connected
    const { metaAccount } = await this.autoConnect(userId);

    const campaigns = await Campaign.findAll({
      include: [{
        model: AdAccount,
        as: 'adAccount',
        where: { meta_account_id: metaAccount.id }
      }]
    });

    const campaignIds = campaigns.map(c => c.id);
    const idList = campaignIds.length > 0 ? campaignIds : [0];

    const insights = await db.sequelize.query(`
      SELECT 
        COALESCE(SUM(ai.impressions),0) as total_impressions,
        COALESCE(SUM(ai.clicks),0) as total_clicks,
        COALESCE(SUM(ai.leads),0) as total_leads,
        COALESCE(SUM(ai.spend),0) as total_spend
      FROM ad_insights ai
      INNER JOIN ads a ON ai.ad_id = a.id
      INNER JOIN ad_sets ads ON a.adset_id = ads.id
      INNER JOIN campaigns c ON ads.campaign_id = c.id
      WHERE c.id IN (:idList)
    `, { replacements: { idList }, type: db.Sequelize.QueryTypes.SELECT });

    const stats = insights[0];
    const totalLeads = parseInt(stats.total_leads) || 0;
    const totalSpend = parseFloat(stats.total_spend) || 0;
    const costPerLead = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : 0;

    const campaignPerformance = await db.sequelize.query(`
      SELECT c.campaign_name, c.status, c.objective,
        COALESCE(SUM(ai.leads),0) as leads,
        COALESCE(SUM(ai.spend),0) as spend,
        COALESCE(SUM(ai.clicks),0) as clicks,
        COALESCE(AVG(ai.ctr),0) as ctr,
        COALESCE(AVG(ai.cpl),0) as cpl
      FROM campaigns c
      LEFT JOIN ad_sets ads ON c.id = ads.campaign_id
      LEFT JOIN ads a ON ads.id = a.adset_id
      LEFT JOIN ad_insights ai ON a.id = ai.ad_id
      WHERE c.id IN (:idList)
      GROUP BY c.id, c.campaign_name, c.status, c.objective
    `, { replacements: { idList }, type: db.Sequelize.QueryTypes.SELECT });

    const adsPerformance = await db.sequelize.query(`
      SELECT a.ad_name, c.campaign_name,
        COALESCE(SUM(ai.leads),0) as leads,
        COALESCE(SUM(ai.clicks),0) as clicks,
        COALESCE(SUM(ai.impressions),0) as impressions
      FROM ads a
      INNER JOIN ad_sets ads ON a.adset_id = ads.id
      INNER JOIN campaigns c ON ads.campaign_id = c.id
      LEFT JOIN ad_insights ai ON a.id = ai.ad_id
      WHERE c.id IN (:idList)
      GROUP BY a.id, a.ad_name, c.campaign_name
      ORDER BY leads DESC
      LIMIT 10
    `, { replacements: { idList }, type: db.Sequelize.QueryTypes.SELECT });

    const leadSourceAnalytics = await db.sequelize.query(`
      SELECT source, COUNT(*) as leads FROM leads GROUP BY source
    `, { type: db.Sequelize.QueryTypes.SELECT });

    return {
      summary: {
        totalCampaigns: campaigns.length,
        totalAdsRunning: 0,
        totalLeadsFromAds: totalLeads,
        totalSpend,
        costPerLead
      },
      campaignPerformance,
      adsPerformance,
      leadSourceAnalytics
    };
  }

  // ─── GET ALL CAMPAIGNS ─────────────────────────────────────────────────────
  async getAllCampaigns(userId) {
    const { metaAccount } = await this.autoConnect(userId);

    return await Campaign.findAll({
      include: [{
        model: AdAccount,
        as: 'adAccount',
        where: { meta_account_id: metaAccount.id }
      }],
      order: [['created_at', 'DESC']]
    });
  }

  // ─── PROCESS META LEAD WEBHOOK ─────────────────────────────────────────────
  async processMetaLead(leadData) {
    const fieldData = {};
    leadData.field_data.forEach(field => {
      fieldData[field.name] = field.values[0];
    });

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

    const crmLead = await this.syncMetaLeadToCRM(metaLead);
    return { metaLead, crmLead };
  }

  async syncMetaLeadToCRM(metaLead) {
    if (metaLead.synced_to_crm) return null;

    const crmLead = await Lead.create({
      lead_code: `LEAD-META-${Date.now()}`,
      name: metaLead.name,
      email: metaLead.email,
      phone: metaLead.phone,
      source: 'Meta Ads',
      status: 'New'
    });

    await metaLead.update({ synced_to_crm: true, crm_lead_id: crmLead.id });
    return crmLead;
  }
}

export default new MetaService();
