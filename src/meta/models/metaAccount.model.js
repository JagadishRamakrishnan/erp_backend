import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const MetaAccount = db.sequelize.define('MetaAccount', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  meta_user_id: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  access_token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  token_expiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'meta_accounts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default MetaAccount;
