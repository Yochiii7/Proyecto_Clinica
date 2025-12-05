const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Paciente = db.define('pacientes', {
  cod_paciente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cedula_paciente: {
    type: DataTypes.CHAR(8),
    allowNull: false,
    unique: true
  },
  nombre_paciente: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido_paciente: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  seguro: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(13),
    allowNull: true
  },
  sexo: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  cargo: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'P'
  },
  estado: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: 'Activo'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'pacientes',
  timestamps: false
});

module.exports = Paciente;
