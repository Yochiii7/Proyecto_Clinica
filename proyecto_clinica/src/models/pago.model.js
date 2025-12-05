import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Pago = sequelize.define("pago", {
  cod_pago: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cod_cita: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodo_pago: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'movil'),
    allowNull: false
  },
  estado_pago: {
    type: DataTypes.ENUM('pendiente', 'completado', 'rechazado'),
    defaultValue: 'pendiente'
  },
  referencia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "pago",
  timestamps: false
});

// Agregar asociaciones
Pago.associate = (models) => {
  Pago.belongsTo(models.Cita, { foreignKey: 'cod_cita' });
};
