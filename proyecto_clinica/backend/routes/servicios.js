const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');

// GET /api/servicios -> Obtener todos
router.get('/', serviciosController.obtenerServicios);

// POST /api/servicios -> Crear uno nuevo
router.post('/', serviciosController.crearServicio);

// PUT /api/servicios/:id -> Actualizar por ID
router.put('/:id', serviciosController.actualizarServicio);

// DELETE /api/servicios/:id -> Eliminar por ID
router.delete('/:id', serviciosController.eliminarServicio);

module.exports = router;