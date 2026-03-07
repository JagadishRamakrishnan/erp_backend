import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Deal = db.sequelize.define('Deal', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  deal_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  customer_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  lead_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'leads',
      key: 'id'
    }
  },
  value: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  stage: {
    type: DataTypes.ENUM('Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'),
    defaultValue: 'Lead'
  },
  probability: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  expected_close_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  assigned_to: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'deals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Deal;
