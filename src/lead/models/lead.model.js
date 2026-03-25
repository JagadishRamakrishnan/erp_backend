import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Lead = db.sequelize.define('Lead', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  lead_code: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  company: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'),
    defaultValue: 'New'
  },
  assigned_to: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  internal_summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summary_updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  summary_updated_by: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'leads',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Lead;
