import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Invoice = db.sequelize.define('Invoice', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_number: {
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
  quotation_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'quotations',
      key: 'id'
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  paid_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  due_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Partial', 'Paid'),
    defaultValue: 'Pending'
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Invoice;
