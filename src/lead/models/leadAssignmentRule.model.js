import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const LeadAssignmentRule = db.sequelize.define('LeadAssignmentRule', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  criteria_field: {
    type: DataTypes.STRING(50), // e.g. 'source', 'service_id'
    allowNull: false
  },
  criteria_value: {
    type: DataTypes.STRING(150), // e.g. 'Facebook', '1'
    allowNull: false
  },
  assign_to: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'lead_assignment_rules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default LeadAssignmentRule;
