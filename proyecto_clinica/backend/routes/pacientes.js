const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

router.get('/', pacientesController.obtenerPacientes);
router.post('/', pacientesController.crearPaciente);
router.put('/:cedula_paciente', pacientesController.actualizarPaciente);
router.delete('/:cedula_paciente', pacientesController.eliminarPaciente);

module.exports = router;
