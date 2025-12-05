import express from 'express';
import { 
  crearPago, 
  listarPagos,
  obtenerPagoPorCita,
  obtenerResumenPagosPorCita,
  actualizarEstadoPago,
  eliminarPago
} from '../controllers/pago.controller.js';

const router = express.Router();

router.post('/', crearPago);
router.get('/', listarPagos);
router.get('/resumen/:cod_cita', obtenerResumenPagosPorCita);
router.get('/cita/:cod_cita', obtenerPagoPorCita);
router.put('/:id/estado', actualizarEstadoPago);
router.delete('/:id', eliminarPago);

export default router;
