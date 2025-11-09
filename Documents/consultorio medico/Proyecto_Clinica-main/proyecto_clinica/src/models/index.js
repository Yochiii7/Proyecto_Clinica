import { sequelize } from '../config/db.js';
import { Paciente } from './paciente.model.js';
import { Doctor } from './doctor.model.js';
import { Especialidad } from './especialidad.model.js';
import { Cita } from './cita.model.js';

// Inicializar relaciones
const models = { Paciente, Doctor, Especialidad, Cita };

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  sequelize,
  Paciente,
  Doctor,
  Especialidad,
  Cita
};