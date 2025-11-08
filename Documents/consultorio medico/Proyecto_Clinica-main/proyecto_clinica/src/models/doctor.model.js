import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Doctor = sequelize.define('Doctor', {
  cod_doctor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni_doctor: {
    type: DataTypes.CHAR(8),
    allowNull: true
  },
  nombre_doctor: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  apellido_doctor: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  sexo: {
    type: DataTypes.CHAR(15),
    allowNull: true
  },
  telefono: {
    type: DataTypes.CHAR(13),
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nacionalidad: {
    type: DataTypes.STRING(35),
    allowNull: true
  },
  estado: {
    type: DataTypes.CHAR(15),
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'doctores',
  timestamps: false
});

// Agregar asociaciones
Doctor.associate = (models) => {
  Doctor.hasMany(models.Cita, { foreignKey: 'cod_doctor' });
};