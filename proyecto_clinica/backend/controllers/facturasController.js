const Factura = require('../models/Factura');
const DetalleFactura = require('../models/DetalleFactura');
const Servicio = require('../models/Servicio');
const Paciente = require('../models/Paciente');

exports.crearFactura = async (req, res) => {
  try {
    const { cod_paciente, fecha_emision, servicios } = req.body;

    if (!cod_paciente || !fecha_emision || servicios.length === 0) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    // Calcular total
    let total = 0;
    servicios.forEach(s => {
      total += s.cantidad * s.precio_unitario;
    });

    const factura = await Factura.create({
      cod_paciente,
      fecha_emision,
      monto_total: total
    });

    // Guardar detalles
    for (const s of servicios) {
      await DetalleFactura.create({
        cod_factura: factura.cod_factura,
        cod_servicio: s.cod_servicio,
        cantidad: s.cantidad,
        precio_unitario: s.precio_unitario,
        subtotal: s.cantidad * s.precio_unitario
      });
    }

    res.json({ mensaje: "Factura creada correctamente", factura });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear factura" });
  }
};


exports.obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.findAll({
      include: [
        { model: Paciente, as: 'paciente' },
        {
          model: DetalleFactura,
          include: [{ model: Servicio, as: 'servicio' }]
        }
      ]
    });

    res.json(facturas);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener facturas" });
  }
};
