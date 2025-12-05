// backend/config/db.js
const { Sequelize } = require('sequelize');

const db = new Sequelize('proyecto', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false, // las tablas ya tienen timestamp si quieres activar quítalo
  }
});

module.exports = db;
