const { DataTypes } = require('sequelize');
const db = require('../config/db');
// IMPORTANTE: Importa el modelo Doctor
const Doctor = require('./Doctor'); // Ajusta la ruta si es necesario

const Servicio = db.define('servicios_medicos', {
  cod_servicio: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_servicio: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },

  cod_doctor: {
    type: DataTypes.INTEGER,
    allowNull: true 
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'servicios_medicos',
  timestamps: false
});

Servicio.belongsTo(Doctor, {
  foreignKey: 'cod_doctor',
  as: 'doctor' // Nombre con el que incluiremos los datos del doctor
});


module.exports = Servicio;