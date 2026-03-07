import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Note = db.sequelize.define('Note', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  related_type: {
    type: DataTypes.ENUM('Lead', 'Customer', 'Deal'),
    allowNull: false
  },
  related_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false
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
  tableName: 'notes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Note;
