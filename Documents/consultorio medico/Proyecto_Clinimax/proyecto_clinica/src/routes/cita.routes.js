import express from 'express';
import { 
  crearCita, 
  listarCitas,
  actualizarCita,
  eliminarCita,
  reporteCitasPorFechas,
  rankingPacientesPorVisitas,
  rankingEspecialidadesPorSolicitudes
} from '../controllers/cita.controller.js';

const router = express.Router();

router.post('/', crearCita);
router.get('/', listarCitas);
router.get('/reporte/por-fechas', reporteCitasPorFechas);
router.get('/reporte/ranking-pacientes', rankingPacientesPorVisitas);
router.get('/reporte/ranking-especialidades', rankingEspecialidadesPorSolicitudes);
router.put('/:id', actualizarCita);
router.delete('/:id', eliminarCita);

export default router;