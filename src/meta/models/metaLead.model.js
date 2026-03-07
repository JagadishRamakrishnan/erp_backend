import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const MetaLead = db.sequelize.define('MetaLead', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  lead_id_meta: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  campaign_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'campaigns',
      key: 'id'
    }
  },
  adset_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'ad_sets',
      key: 'id'
    }
  },
  ad_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'ads',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  form_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  created_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  synced_to_crm: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  crm_lead_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'leads',
      key: 'id'
    }
  }
}, {
  tableName: 'meta_leads',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default MetaLead;
