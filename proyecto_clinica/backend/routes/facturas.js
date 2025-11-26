const express = require('express');
const router = express.Router();
const facturasController = require('../controllers/facturasController');

router.post('/', facturasController.crearFactura);
router.get('/', facturasController.obtenerFacturas);

module.exports = router;
