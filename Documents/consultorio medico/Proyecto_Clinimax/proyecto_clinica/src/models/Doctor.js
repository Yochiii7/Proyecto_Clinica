/* eslint-env node */

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Doctor = sequelize.define('pacientes', {
    cod_doctor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dni_doctor: {
        type: DataTypes.CHAR(8),
        allowNull: false,
        unique: true
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
        allowNull: true
    },
    telefono: {
        type: DataTypes.CHAR(13),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    nacionalidad: {
        type: DataTypes.STRING(35),
        allowNull: false,
        defaultValue: 'Venezolano(a)'
    },
    estado: {
        type: DataTypes.CHAR(15),
        allowNull: false,
        defaultValue: 'Activo'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'doctores',
    timestamps: false // Si tienes fecha_creacion manual, desactiva timestamps automáticos
});

// Asociación (Para cuando integres con Citas)
Doctor.associate = (models) => {
    if (models.Cita) {
        Doctor.hasMany(models.Cita, { foreignKey: 'cod_doctor' });
    }
};

export default Doctor;
