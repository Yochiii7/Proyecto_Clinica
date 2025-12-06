const express = require('express');
const router = express.Router();
const especialidadesController = require('../controllers/especialidadesController');

router.get('/', especialidadesController.obtenerEspecialidades);
router.post('/', especialidadesController.crearEspecialidad);

module.exports = router;
