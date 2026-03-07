import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Payment = db.sequelize.define('Payment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'invoices',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('Cash', 'UPI', 'Card', 'Bank'),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reference_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Payment;
