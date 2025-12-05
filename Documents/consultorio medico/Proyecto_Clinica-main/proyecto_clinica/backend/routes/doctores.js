const express = require('express');
const router = express.Router();
const doctoresController = require('../controllers/doctoresController');

// Usamos el DNI como parámetro, igual que la cédula en pacientes
router.get('/', doctoresController.obtenerDoctores);
router.post('/', doctoresController.crearDoctor);
router.put('/:dni_doctor', doctoresController.actualizarDoctor);
router.delete('/:dni_doctor', doctoresController.eliminarDoctor);

module.exports = router;