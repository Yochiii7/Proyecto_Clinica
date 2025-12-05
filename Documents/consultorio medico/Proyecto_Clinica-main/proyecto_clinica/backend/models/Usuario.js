const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Usuario = db.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  usuario: { // Nombre de usuario para login
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  clave: {
    type: DataTypes.STRING(255), // Longitud suficiente para el hash
    allowNull: false
  },
  cargo: {
    type: DataTypes.CHAR(1), // Ejemplo: 'A' admin, 'M' médico, 'S' secretaria
    allowNull: false
  }
}, {
  tableName: 'usuarios',
  timestamps: false // Tu tabla SQL no tiene created_at/updated_at
});

module.exports = Usuario;
