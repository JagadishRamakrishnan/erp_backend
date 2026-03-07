import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Ticket = db.sequelize.define('Ticket', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  ticket_number: {
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
  subject: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Open', 'In Progress', 'Closed'),
    defaultValue: 'Open'
  },
  assigned_to: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'tickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Ticket;
