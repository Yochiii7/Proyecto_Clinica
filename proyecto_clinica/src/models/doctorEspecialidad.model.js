import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const DoctorEspecialidad = sequelize.define('DoctorEspecialidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cod_doctor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cod_especialidad: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'doctor_especialidad',
  timestamps: false
});

// Asociaciones serán configuradas desde models/index.js
