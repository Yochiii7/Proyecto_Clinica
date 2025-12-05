import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Especialidad = sequelize.define('Especialidad', {
  cod_especialidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_especialidad: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'especialidad',
  timestamps: false
});

// Agregar asociaciones
Especialidad.associate = (models) => {
  Especialidad.hasMany(models.Cita, { foreignKey: 'cod_especialidad' });
};