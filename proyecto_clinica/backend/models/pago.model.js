const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Paciente = require('./Paciente');

// Modelo que mapea la tabla `pagos` existente en la BD.
// Solo usamos las columnas reales de la tabla. Campos extra que maneja la UI
// (medico, estado, notas, concepto como texto) se derivan o se devuelven
// como valores por defecto desde el controlador.

const Pago = db.define('pagos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cod_paciente: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_tipo_pago: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  fecha_pago: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'pagos',
  timestamps: false
});

// Asociaciones (siempre que exista el modelo Paciente)
if (Paciente) {
  Pago.belongsTo(Paciente, { foreignKey: 'cod_paciente', as: 'Paciente' });
}

module.exports = Pago;
