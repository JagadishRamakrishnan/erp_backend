# Meta Ads Module - Quick Start Guide

Get started with Meta Ads integration in 5 minutes!

## 🚀 Quick Setup

### Step 1: Connect Meta Account

```bash
POST /api/meta/connect
Authorization: Bearer YOUR_JWT_TOKEN

{
  "access_token": "YOUR_META_ACCESS_TOKEN",
  "meta_user_id": "123456789",
  "token_expiry": "2024-12-31T23:59:59Z"
}
```

### Step 2: Sync Ad Accounts

```bash
POST /api/meta/ad-accounts/sync
Authorization: Bearer YOUR_JWT_TOKEN

{
  "ad_accounts": [
    {
      "ad_account_id": "act_123456",
      "name": "My Business Ad Account",
      "currency": "USD",
      "timezone": "America/Los_Angeles"
    }
  ]
}
```

### Step 3: Sync Campaigns

```bash
POST /api/meta/campaigns/sync
Authorization: Bearer YOUR_JWT_TOKEN

{
  "ad_account_id": 1,
  "campaigns": [
    {
      "campaign_id": "123456789",
      "campaign_name": "Lead Generation Campaign",
      "objective": "LEAD_GENERATION",
      "status": "Active",
      "daily_budget": 100.00,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31"
    }
  ]
}
```

### Step 4: View Dashboard

```bash
GET /api/meta/dashboard
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Dashboard Response Example

```json
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
    "campaignPerformance": [
      {
        "campaign_name": "Summer Sale",
        "leads": 50,
        "spend": 500.00,
        "clicks": 1000,
        "ctr": 5.0,
        "cpl": 10.00
      }
    ],
    "adsPerformance": [
      {
        "ad_name": "Creative A",
        "campaign_name": "Summer Sale",
        "leads": 25,
        "clicks": 500,
        "impressions": 10000
      }
    ],
    "leadSourceAnalytics": [
      {
        "source": "Meta Ads",
        "leads": 120
      },
      {
        "source": "Website",
        "leads": 50
      }
    ]
  }
}
```

## 🔗 Webhook Setup for Lead Forms

### Configure Webhook in Meta

1. Go to Meta App Dashboard
2. Navigate to Webhooks
3. Subscribe to `leadgen` events
4. Set webhook URL: `https://your-domain.com/api/meta/webhook/lead`
5. Verify webhook

### Webhook Payload Example

When a user submits a lead form, Meta will send:

```json
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

### What Happens Automatically

1. Lead stored in `meta_leads` table
2. Lead synced to `leads` table
3. Source set to "Meta Ads"
4. Campaign tracking maintained
5. Sales team can follow up

## 📈 Key Metrics Calculated

### Cost Per Lead (CPL)
```
CPL = Total Spend ÷ Total Leads
Example: $500 ÷ 50 leads = $10 per lead
```

### Click Through Rate (CTR)
```
CTR = (Clicks ÷ Impressions) × 100
Example: (500 ÷ 10,000) × 100 = 5%
```

### Cost Per Click (CPC)
```
CPC = Total Spend ÷ Total Clicks
Example: $500 ÷ 1,000 clicks = $0.50 per click
```

## 🔄 Complete Sync Flow

```javascript
// 1. Connect Meta Account
const connectResponse = await fetch('/api/meta/connect', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    access_token: 'META_TOKEN',
    meta_user_id: '123456789'
  })
});

// 2. Sync Ad Accounts
const adAccountsResponse = await fetch('/api/meta/ad-accounts/sync', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ad_accounts: [/* ad accounts data */]
  })
});

// 3. Sync Campaigns
const campaignsResponse = await fetch('/api/meta/campaigns/sync', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ad_account_id: 1,
    campaigns: [/* campaigns data */]
  })
});

// 4. Get Dashboard
const dashboardResponse = await fetch('/api/meta/dashboard', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});

const dashboard = await dashboardResponse.json();
console.log(dashboard.data);
```

## 🎯 Use Cases

### Marketing Manager
- Track campaign ROI
- Monitor cost per lead
- Optimize ad spend
- Compare campaign performance

### Sales Team
- Follow up on Meta leads
- Track lead source
- Prioritize high-quality leads
- View lead history

### Business Owner
- View overall marketing performance
- Track total ad spend
- Monitor lead generation
- Calculate ROI

## 🔐 Security Best Practices

1. **Store tokens securely** - Encrypt access tokens in database
2. **Implement token refresh** - Meta tokens expire, refresh them automatically
3. **Validate webhooks** - Verify webhook signatures from Meta
4. **Use HTTPS** - Always use HTTPS for webhook endpoints
5. **Rate limiting** - Implement rate limiting for API calls

## 📝 Testing

### Test Webhook Locally

Use ngrok to expose local server:

```bash
ngrok http 5000
```

Then use the ngrok URL for webhook:
```
https://abc123.ngrok.io/api/meta/webhook/lead
```

### Test with Postman

Import the API endpoints into Postman and test each endpoint with sample data.

## 🐛 Troubleshooting

### Issue: "Meta account not connected"
**Solution**: Call `/api/meta/connect` first to connect your Meta account

### Issue: "Access token expired"
**Solution**: Implement token refresh logic or reconnect the account

### Issue: "Webhook not receiving leads"
**Solution**: 
- Verify webhook URL is correct
- Check webhook is subscribed to `leadgen` events
- Ensure webhook responds within 20 seconds
- Check server logs for errors

### Issue: "Dashboard shows no data"
**Solution**: 
- Sync campaigns, ad sets, ads first
- Sync insights data
- Ensure data exists in Meta account

## 📚 Next Steps

1. Set up automated sync (cron jobs)
2. Implement token refresh mechanism
3. Add more analytics and reports
4. Create custom dashboards
5. Integrate with other marketing platforms

## 🔗 Useful Links

- [Meta Marketing API Docs](https://developers.facebook.com/docs/marketing-apis)
- [Meta Lead Ads Guide](https://developers.facebook.com/docs/marketing-api/guides/lead-ads)
- [Webhook Setup Guide](https://developers.facebook.com/docs/graph-api/webhooks)

---

**Need Help?** Check the full documentation in `META-ADS-MODULE.md`
