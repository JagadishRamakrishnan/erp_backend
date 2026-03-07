import metaService from '../service/meta.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class MetaController {
  // Connect Meta Account
  async connect(req, res) {
    try {
      const metaAccount = await metaService.connectMetaAccount(req.user.id, req.body);
      return successResponse(res, metaAccount, 'Meta account connected successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get Meta Account
  async getAccount(req, res) {
    try {
      const metaAccount = await metaService.getMetaAccountByUser(req.user.id);
      if (!metaAccount) {
        return errorResponse(res, 'Meta account not connected', 404);
      }
      return successResponse(res, metaAccount);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Sync Ad Accounts
  async syncAdAccounts(req, res) {
    try {
      const metaAccount = await metaService.getMetaAccountByUser(req.user.id);
      if (!metaAccount) {
        return errorResponse(res, 'Meta account not connected', 404);
      }

      // In production, fetch from Meta API
      // For now, accept from request body
      const adAccounts = await metaService.syncAdAccounts(metaAccount.id, req.body.ad_accounts);
      return successResponse(res, adAccounts, 'Ad accounts synced successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Sync Campaigns
  async syncCampaigns(req, res) {
    try {
      const { ad_account_id, campaigns } = req.body;
      
      const campaigns_synced = await metaService.syncCampaigns(ad_account_id, campaigns);
      return successResponse(res, campaigns_synced, 'Campaigns synced successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Sync Ad Sets
  async syncAdSets(req, res) {
    try {
      const { campaign_id, ad_sets } = req.body;
      
      const adSets = await metaService.syncAdSets(campaign_id, ad_sets);
      return successResponse(res, adSets, 'Ad sets synced successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Sync Ads
  async syncAds(req, res) {
    try {
      const { adset_id, ads } = req.body;
      
      const adsData = await metaService.syncAds(adset_id, ads);
      return successResponse(res, adsData, 'Ads synced successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Sync Insights
  async syncInsights(req, res) {
    try {
      const { ad_id, insights } = req.body;
      
      const insightsData = await metaService.syncAdInsights(ad_id, insights);
      return successResponse(res, insightsData, 'Insights synced successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Webhook for Meta Leads
  async webhookLead(req, res) {
    try {
      const result = await metaService.processMetaLead(req.body);
      return successResponse(res, result, 'Lead processed successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get Dashboard
  async getDashboard(req, res) {
    try {
      const dashboardData = await metaService.getDashboardData(req.user.id);
      return successResponse(res, dashboardData);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get All Campaigns
  async getCampaigns(req, res) {
    try {
      const campaigns = await metaService.getAllCampaigns(req.user.id);
      return successResponse(res, campaigns);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new MetaController();
