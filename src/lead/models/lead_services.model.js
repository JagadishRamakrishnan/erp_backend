import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const LeadServices = db.sequelize.define('LeadServices', {
  lead_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: {
      model: 'leads',
      key: 'id'
    }
  },
  service_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    references: {
      model: 'service_catalog',
      key: 'id'
    }
  }
}, {
  tableName: 'lead_services',
  timestamps: false
});

export default LeadServices;
