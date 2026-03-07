import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Quotation = db.sequelize.define('Quotation', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  quotation_number: {
    type: DataTypes.STRING(50),
    unique: true,
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
  deal_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'deals',
      key: 'id'
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Sent', 'Approved', 'Rejected'),
    defaultValue: 'Draft'
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'quotations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Quotation;
