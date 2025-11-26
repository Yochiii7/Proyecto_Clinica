const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Factura = require('./Factura');
const Servicio = require('./Servicio');

const DetalleFactura = db.define('detalle_factura', {
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cod_factura: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cod_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'detalle_factura',
  timestamps: false
});

DetalleFactura.belongsTo(Factura, {
  foreignKey: 'cod_factura'
});
DetalleFactura.belongsTo(Servicio, {
  foreignKey: 'cod_servicio',
  as: 'servicio'
});

module.exports = DetalleFactura;
