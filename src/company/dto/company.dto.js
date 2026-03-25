import Joi from 'joi';

const companyFields = {
  name: Joi.string().min(2).max(150),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().max(20).allow('', null).optional(),
  website: Joi.string().max(255).allow('', null).optional(),
  industry: Joi.string().max(100).allow('', null).optional(),
  company_size: Joi.string().max(50).allow('', null).optional(),
  address: Joi.string().allow('', null).optional(),
  city: Joi.string().max(100).allow('', null).optional(),
  state: Joi.string().max(100).allow('', null).optional(),
  country: Joi.string().max(100).allow('', null).optional(),
  description: Joi.string().allow('', null).optional(),
  gst_number: Joi.string().max(20).allow('', null).optional(),
  pan_number: Joi.string().max(20).allow('', null).optional(),
  logo_url: Joi.string().max(500).allow('', null).optional(),
  annual_revenue: Joi.number().allow(null).optional(),
  founded_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).allow(null).optional(),
  linkedin_url: Joi.string().max(255).allow('', null).optional(),
  twitter_url: Joi.string().max(255).allow('', null).optional(),
  status: Joi.string().valid('Active', 'Inactive').optional()
};

const createCompanyDto = Joi.object({
  ...companyFields,
  name: companyFields.name.required()
});

const updateCompanyDto = Joi.object(companyFields);

export { createCompanyDto, updateCompanyDto };
