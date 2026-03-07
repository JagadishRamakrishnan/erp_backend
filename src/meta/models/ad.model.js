import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Ad = db.sequelize.define('Ad', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  adset_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'ad_sets',
      key: 'id'
    }
  },
  ad_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  ad_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Paused'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'ads',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Ad;
