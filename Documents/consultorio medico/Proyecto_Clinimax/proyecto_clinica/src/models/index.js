import { sequelize } from '../config/db.js';
import Paciente from './Paciente.js';
import Doctor from './Doctor.js';
import { Especialidad } from './especialidad.model.js';
import { Cita } from './cita.model.js';
import { DoctorEspecialidad } from './doctorEspecialidad.model.js';

// Inicializar relaciones
const models = { Paciente, Doctor, Especialidad, Cita, DoctorEspecialidad };

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
  Cita,
  DoctorEspecialidad
};
