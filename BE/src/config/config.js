const dotenv = require('dotenv');

// Load biến môi trường từ tệp .env
dotenv.config();
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;
// Cấu hình Sequelize
const config = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'mysql',
  },
};

module.exports = config;
