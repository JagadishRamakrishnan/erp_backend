import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const AdAccount = db.sequelize.define('AdAccount', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  meta_account_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'meta_accounts',
      key: 'id'
    }
  },
  ad_account_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  timezone: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'ad_accounts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default AdAccount;
