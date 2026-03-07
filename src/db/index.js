import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("mysql://dutch:DutchDB123@167.71.229.209:3306/crm");

const db = {
  sequelize,
  Sequelize
};

export default db;
