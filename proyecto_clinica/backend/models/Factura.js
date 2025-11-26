const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Paciente = require('./Paciente');

const Factura = db.define('factura', {
  cod_factura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cod_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_emision: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  monto_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'factura',
  timestamps: false
});

Factura.belongsTo(Paciente, {
  foreignKey: 'cod_paciente',
  as: 'paciente'
});

module.exports = Factura;
