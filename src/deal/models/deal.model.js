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
    allowNull: false,
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
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'INR'
  },
  weighted_value: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  stage: {
    type: DataTypes.ENUM(
      'Qualification', 
      'Needs Analysis', 
      'Value Proposition', 
      'Id. Decision Makers', 
      'Perception Analysis', 
      'Proposal/Price Quote', 
      'Negotiation/Review', 
      'Closed Won', 
      'Closed Lost'
    ),
    defaultValue: 'Qualification'
  },
  probability: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 10,
    validate: {
      min: 0,
      max: 100
    }
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium'
  },
  deal_type: {
    type: DataTypes.ENUM('New Business', 'Existing Business'),
    defaultValue: 'New Business'
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true
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
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  loss_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  service_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'service_catalog',
      key: 'id'
    }
  }
}, {
  tableName: 'deals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeSave: (deal) => {
      // Calculate weighted value
      if (deal.value && deal.probability) {
        deal.weighted_value = (deal.value * deal.probability) / 100;
      }
    }
  }
});

export default Deal;
