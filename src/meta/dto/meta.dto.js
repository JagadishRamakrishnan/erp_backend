import Joi from 'joi';

export const connectMetaDto = Joi.object({
  access_token: Joi.string().required(),
  meta_user_id: Joi.string().required(),
  token_expiry: Joi.date().optional()
});

export const syncCampaignsDto = Joi.object({
  ad_account_id: Joi.string().required()
});

export const syncInsightsDto = Joi.object({
  campaign_id: Joi.number().optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional()
});

export const webhookLeadDto = Joi.object({
  lead_id: Joi.string().required(),
  campaign_id: Joi.string().optional(),
  adset_id: Joi.string().optional(),
  ad_id: Joi.string().optional(),
  form_id: Joi.string().optional(),
  field_data: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      values: Joi.array().items(Joi.string()).required()
    })
  ).required()
});
