import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const ServiceCatalog = db.sequelize.define('ServiceCatalog', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  unit_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  tax_percent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'INR'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'service_catalog',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ServiceCatalog;
