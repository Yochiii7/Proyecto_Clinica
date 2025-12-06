const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Especialidad = db.define('especialidad', {
  cod_especialidad: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_especialidad: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'especialidad',
  timestamps: false
});

module.exports = Especialidad;
