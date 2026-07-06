import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "crm",
  "root",
  "Root@12345",
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false,
  }
);

const db = {
  sequelize,
  Sequelize,
};

export default db;