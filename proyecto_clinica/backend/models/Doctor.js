const { DataTypes } = require('sequelize');
const db = require('../config/db'); // La conexión a tu BD

const Doctor = db.define('doctores', {
  cod_doctor: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  dni_doctor: {
    type: DataTypes.CHAR(8),
    allowNull: false
    // Si es único, añade: unique: true
  },
  nombre_doctor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido_doctor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  sexo: {
    type: DataTypes.CHAR(15),
    allowNull: false
  },
  telefono: {
    type: DataTypes.CHAR(13),
    allowNull: false
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY, // Importante: DATEONLY para 'date' (sin hora)
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: false
    // Si es único, añade: unique: true
  },
  nacionalidad: {
    type: DataTypes.STRING(35),
    allowNull: false
  },
  estado: {
    type: DataTypes.CHAR(15),
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Aquí iría la foreign key a usuarios si la defines
  }
}, {
  tableName: 'doctores',
  timestamps: false // Usamos 'fecha_creacion' manualmente
});

module.exports = Doctor;