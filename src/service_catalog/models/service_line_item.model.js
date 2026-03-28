import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const ServiceLineItem = db.sequelize.define('ServiceLineItem', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  service_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'service_catalog',
      key: 'id'
    }
  },
  item_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qty: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1
  },
  unit_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  tax_percent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  }
}, {
  tableName: 'service_line_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ServiceLineItem;
