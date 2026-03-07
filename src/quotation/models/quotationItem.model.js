import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const QuotationItem = db.sequelize.define('QuotationItem', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  quotation_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'quotations',
      key: 'id'
    }
  },
  product_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  tableName: 'quotation_items',
  timestamps: false
});

export default QuotationItem;
