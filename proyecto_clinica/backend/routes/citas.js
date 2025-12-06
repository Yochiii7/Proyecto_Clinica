const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citasController');

router.get('/', citasController.obtenerCitas);
router.post('/', citasController.crearCita);
router.put('/:id', citasController.actualizarCita);
router.delete('/:id', citasController.eliminarCita);

// Reportes
router.get('/reporte/por-fechas', citasController.reportePorFechas);
router.get('/reporte/ranking-pacientes', citasController.reporteRankingPacientes);
router.get('/reporte/ranking-especialidades', citasController.reporteRankingEspecialidades);

module.exports = router;
