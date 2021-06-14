const Sequelize = require("sequelize");

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbURL = `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

const sequelize = new Sequelize(dbURL, {
  logging: false
});

module.exports = sequelize;
