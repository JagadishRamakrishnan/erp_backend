import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

// Debug (remove after confirming it works)
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "******" : undefined,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Connection error:");
    console.error(err);
  }
})();

const db = {
  sequelize,
  Sequelize,
};

export default db;