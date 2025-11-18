import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Paciente = sequelize.define('Paciente', {
  cod_paciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni_paciente: {
    type: DataTypes.CHAR(8),
    allowNull: true
  },
  nombre_paciente: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  apellido_paciente: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  seguro: {
    type: DataTypes.CHAR(10),
    allowNull: true
  },
  telefono: {
    type: DataTypes.CHAR(15),
    allowNull: true
  },
  sexo: {
    type: DataTypes.CHAR(15),
    allowNull: true
  },
  cargo: {
    type: DataTypes.CHAR(1),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(15),
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
  tableName: 'pacientes',
  timestamps: false
});

// Agregar asociaciones
Paciente.associate = (models) => {
  Paciente.hasMany(models.Cita, { foreignKey: 'cod_paciente' });
};