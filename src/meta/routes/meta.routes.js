import express from 'express';
import metaController from '../controller/meta.controller.js';
import authenticate from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import { connectMetaDto, webhookLeadDto } from '../dto/meta.dto.js';

const router = express.Router();

// Connect Meta Account
router.post('/connect', authenticate, validate(connectMetaDto), metaController.connect);

// Get Meta Account
router.get('/account', authenticate, metaController.getAccount);

// Sync Ad Accounts
router.post('/ad-accounts/sync', authenticate, metaController.syncAdAccounts);

// Sync Campaigns
router.post('/campaigns/sync', authenticate, metaController.syncCampaigns);

// Sync Ad Sets
router.post('/adsets/sync', authenticate, metaController.syncAdSets);

// Sync Ads
router.post('/ads/sync', authenticate, metaController.syncAds);

// Sync Insights
router.post('/insights/sync', authenticate, metaController.syncInsights);

// Get Dashboard
router.get('/dashboard', authenticate, metaController.getDashboard);

// Get Campaigns
router.get('/campaigns', authenticate, metaController.getCampaigns);

// Create Campaign on Facebook
router.post('/campaigns/create', authenticate, metaController.createCampaign);

// Sync real data from Facebook
router.post('/sync', authenticate, metaController.syncFromFacebook);

// Webhook for Meta Leads (no auth - Meta will call this)
router.post('/webhook/lead', validate(webhookLeadDto), metaController.webhookLead);

export default router;
