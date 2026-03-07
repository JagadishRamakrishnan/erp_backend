# Meta Ads Management Module

Complete integration with Meta Platforms (Facebook & Instagram) Ads to track marketing performance inside the CRM.

## 📊 Module Overview

This module enables:
- Connect Meta (Facebook/Instagram) advertising accounts
- Sync campaigns, ad sets, and ads
- Track ad performance metrics
- Capture leads from Meta Lead Forms
- Automatic lead sync to CRM
- Marketing dashboard with analytics
- ROI and performance tracking

## 🏗️ Database Structure

### Tables Created

1. **meta_accounts** - Connected Meta accounts
2. **ad_accounts** - Meta ad accounts
3. **campaigns** - Ad campaigns
4. **ad_sets** - Ad sets (ad groups)
5. **ads** - Individual ads
6. **ad_insights** - Performance metrics
7. **meta_leads** - Leads from Meta forms

### Relationships

```
users → meta_accounts → ad_accounts → campaigns → ad_sets → ads → ad_insights
                                                                  ↓
                                                            meta_leads → leads (CRM)
```

## 🔄 Workflows

### 1. Campaign Creation Flow

```
Marketing User Connects Meta Account
         ↓
Fetch Ad Accounts
         ↓
Fetch Campaigns
         ↓
Fetch Ad Sets
         ↓
Fetch Ads
         ↓
Sync Leads From Meta Lead Forms
         ↓
Store Leads in CRM Leads Table
         ↓
Track Performance
```

### 2. Lead Generation Flow

```
User clicks Facebook/Instagram Ad
         ↓
Meta Lead Form Opens
         ↓
User submits form
         ↓
Meta Webhook triggered
         ↓
CRM receives Lead
         ↓
Lead stored in leads table
         ↓
Source = "Meta Ads"
         ↓
Sales team follows up
```

### 3. Performance Tracking Flow

```
Campaign Running
       ↓
Ad Impressions
       ↓
Ad Clicks
       ↓
Leads Generated
       ↓
Cost Calculated
       ↓
ROI calculated
       ↓
Dashboard Analytics
```

## 📡 API Endpoints

### Connect Meta Account
```
POST /api/meta/connect
Authorization: Bearer <token>

Body:
{
  "access_token": "META_ACCESS_TOKEN",
  "meta_user_id": "123456789",
  "token_expiry": "2024-12-31T23:59:59Z"
}
```

### Get Meta Account
```
GET /api/meta/account
Authorization: Bearer <token>
```

### Sync Ad Accounts
```
POST /api/meta/ad-accounts/sync
Authorization: Bearer <token>

Body:
{
  "ad_accounts": [
    {
      "ad_account_id": "act_123456",
      "name": "My Ad Account",
      "currency": "USD",
      "timezone": "America/Los_Angeles"
    }
  ]
}
```

### Sync Campaigns
```
POST /api/meta/campaigns/sync
Authorization: Bearer <token>

Body:
{
  "ad_account_id": 1,
  "campaigns": [
    {
      "campaign_id": "123456789",
      "campaign_name": "Summer Sale 2024",
      "objective": "LEAD_GENERATION",
      "status": "Active",
      "daily_budget": 100.00,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31"
    }
  ]
}
```

### Sync Ad Sets
```
POST /api/meta/adsets/sync
Authorization: Bearer <token>

Body:
{
  "campaign_id": 1,
  "ad_sets": [
    {
      "adset_id": "987654321",
      "adset_name": "Target Audience 1",
      "budget": 50.00,
      "status": "Active"
    }
  ]
}
```

### Sync Ads
```
POST /api/meta/ads/sync
Authorization: Bearer <token>

Body:
{
  "adset_id": 1,
  "ads": [
    {
      "ad_id": "111222333",
      "ad_name": "Creative A",
      "status": "Active"
    }
  ]
}
```

### Sync Insights
```
POST /api/meta/insights/sync
Authorization: Bearer <token>

Body:
{
  "ad_id": 1,
  "insights": [
    {
      "date": "2024-01-15",
      "impressions": 10000,
      "clicks": 500,
      "leads": 25,
      "spend": 50.00
    }
  ]
}
```

### Get Dashboard
```
GET /api/meta/dashboard
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "summary": {
      "totalCampaigns": 5,
      "totalAdsRunning": 20,
      "totalLeadsFromAds": 150,
      "totalSpend": 5000.00,
      "costPerLead": 33.33
    },
    "campaignPerformance": [...],
    "adsPerformance": [...],
    "leadSourceAnalytics": [...]
  }
}
```

### Get Campaigns
```
GET /api/meta/campaigns
Authorization: Bearer <token>
```

### Webhook for Meta Leads
```
POST /api/meta/webhook/lead

Body:
{
  "lead_id": "lead_123456",
  "campaign_id": "123456789",
  "adset_id": "987654321",
  "ad_id": "111222333",
  "form_id": "form_123",
  "field_data": [
    {
      "name": "full_name",
      "values": ["John Doe"]
    },
    {
      "name": "email",
      "values": ["john@example.com"]
    },
    {
      "name": "phone_number",
      "values": ["+1234567890"]
    }
  ]
}
```

## 📈 Dashboard Metrics

### Summary Cards
- Total Campaigns
- Total Ads Running
- Total Leads from Ads
- Total Spend
- Cost Per Lead (CPL)

### Campaign Analytics
| Campaign | Leads | Spend | Clicks | CTR | CPL |
|----------|-------|-------|--------|-----|-----|
| Summer Sale | 50 | $500 | 1000 | 5% | $10 |

### Ads Performance
| Ad Name | Campaign | Leads | Clicks | Impressions |
|---------|----------|-------|--------|-------------|
| Creative A | Summer Sale | 25 | 500 | 10000 |

### Lead Source Analytics
| Source | Leads |
|--------|-------|
| Meta Ads | 120 |
| Website | 50 |
| Referral | 20 |

## 🧮 Calculated Metrics

### Cost Per Lead (CPL)
```
CPL = Total Spend / Total Leads
```

### Click Through Rate (CTR)
```
CTR = (Clicks / Impressions) × 100
```

### Cost Per Click (CPC)
```
CPC = Total Spend / Total Clicks
```

### Conversion Rate
```
Conversion Rate = (Leads / Clicks) × 100
```

### ROI (Return on Investment)
```
ROI = (Revenue - Ad Spend) / Ad Spend × 100
```

## 🔗 Lead Integration with CRM

When a lead comes from Meta:

1. Lead captured in `meta_leads` table
2. Automatically synced to `leads` table
3. Source set to "Meta Ads"
4. Campaign tracking maintained
5. Sales team can follow up

### Lead Tracking Benefits
- Which campaign generated the lead
- Which ad performed best
- Cost per lead by campaign
- Lead quality by source
- Sales conversion tracking

## 🚀 Setup Instructions

### 1. Meta App Configuration

1. Create a Meta App at [developers.facebook.com](https://developers.facebook.com)
2. Add "Marketing API" product
3. Get App ID and App Secret
4. Configure OAuth redirect URL
5. Request permissions:
   - `ads_read`
   - `ads_management`
   - `leads_retrieval`

### 2. Webhook Setup

1. Configure webhook URL: `https://your-domain.com/api/meta/webhook/lead`
2. Subscribe to `leadgen` events
3. Verify webhook token
4. Test webhook delivery

### 3. Connect Account

Use the `/api/meta/connect` endpoint to connect a Meta account with access token.

### 4. Sync Data

1. Sync ad accounts
2. Sync campaigns
3. Sync ad sets
4. Sync ads
5. Sync insights (daily)

## 📊 Data Flow

```
Meta Ads Platform
       ↓
Meta API / Webhook
       ↓
CRM Backend
       ↓
Database Tables
       ↓
Dashboard Analytics
```

## 🔐 Security Considerations

- Store access tokens securely (encrypted)
- Implement token refresh mechanism
- Validate webhook signatures
- Rate limit API calls
- Use HTTPS for webhooks
- Implement proper error handling

## 🎯 Use Cases

1. **Marketing Team**: Track campaign performance
2. **Sales Team**: Follow up on Meta leads
3. **Management**: View ROI and analytics
4. **Finance**: Track ad spend
5. **Analytics**: Compare lead sources

## 📝 Notes

- Access tokens expire - implement refresh logic
- Sync insights daily for accurate metrics
- Meta API has rate limits - implement queuing
- Webhook must respond within 20 seconds
- Test with Meta's test tools before production

## 🔄 Automated Sync (Recommended)

Set up cron jobs to:
- Refresh access tokens (daily)
- Sync campaigns (hourly)
- Sync insights (daily)
- Sync leads (real-time via webhook)

## 📚 Resources

- [Meta Marketing API Documentation](https://developers.facebook.com/docs/marketing-apis)
- [Meta Lead Ads Documentation](https://developers.facebook.com/docs/marketing-api/guides/lead-ads)
- [Meta Webhooks Documentation](https://developers.facebook.com/docs/graph-api/webhooks)

---

**Status**: ✅ Ready for Integration
**Version**: 1.0.0
