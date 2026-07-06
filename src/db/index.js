import { Sequelize } from "sequelize";

const sequelize = new Sequelize("crm", "root", "Root@12345", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
  logging: console.log,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Connection error:");
    console.error(err);
  }
})();

export default {
  sequelize,
  Sequelize,
};