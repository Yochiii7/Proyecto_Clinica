import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Precio = sequelize.define("precio", {
  cod_precio: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cod_especialidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  monto_base: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "precios",
  timestamps: false
});

// Agregar asociaciones
Precio.associate = (models) => {
  Precio.belongsTo(models.Especialidad, { foreignKey: 'cod_especialidad' });
};
