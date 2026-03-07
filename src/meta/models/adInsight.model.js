import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const AdInsight = db.sequelize.define('AdInsight', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  ad_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'ads',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  leads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  spend: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  cpc: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  cpl: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  ctr: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  }
}, {
  tableName: 'ad_insights',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['ad_id', 'date']
    }
  ]
});

export default AdInsight;
