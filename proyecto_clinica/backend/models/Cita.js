const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Cita = db.define('cita', {
  cod_cita: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  cod_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cod_doctor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cod_especialidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'P'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cita',
  timestamps: false
});

module.exports = Cita;
