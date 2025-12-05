const Pago = require('../models/pago.model');
const Paciente = require('../models/Paciente');
const Doctor = require('../models/Doctor');

// Normaliza un registro de Pago + asociaciones al formato que espera el front
const mapPagoToDTO = (pago) => {
  const pacienteNombre = pago && pago.Paciente
    ? `${pago.Paciente.nombre_paciente || ''} ${pago.Paciente.apellido_paciente || ''}`.trim()
    : pago && pago.cod_paciente
      ? `Paciente #${pago.cod_paciente}`
      : 'Paciente no asignado';

  return {
    id: pago.id,
    paciente: pacienteNombre,
    medico: pago.medico || 'N/D',          // Valor por defecto si no existe columna
    concepto: pago.concepto || 'Servicio', // Valor por defecto
    monto: Number(pago.monto || 0),
    fecha: pago.fecha_pago || null,
    estado: pago.estado || 'pendiente',    // Valor por defecto
    notas: pago.notas || ''                // Valor por defecto
  };
};

// GET /api/pagos
exports.listarPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      include: [
        { model: Paciente, attributes: ['nombre_paciente', 'apellido_paciente'] }
      ],
      order: [['fecha_pago', 'DESC'], ['id', 'DESC']]
    });

    const data = pagos.map(mapPagoToDTO);
    res.json(data);
  } catch (error) {
    console.error('Error al listar pagos:', error);
    res.status(500).json({ message: 'Error al listar pagos', error: error.message });
  }
};

// POST /api/pagos
exports.crearPago = async (req, res) => {
  try {
    const { cod_paciente, cod_medico, monto, fecha, id_servicio, id_tipo_pago, id_usuario } = req.body;

    console.log('📝 Datos recibidos:', { cod_paciente, cod_medico, monto, fecha });

    if (!monto || !fecha) {
      return res.status(400).json({ message: 'Los campos monto y fecha son obligatorios.' });
    }

    const nuevoPago = await Pago.create({
      cod_paciente: cod_paciente || null,
      id_servicio: id_servicio || null,
      id_tipo_pago: id_tipo_pago || null,
      monto,
      fecha_pago: fecha,
      id_usuario: id_usuario || null
    });

    const pagoConAsociaciones = await Pago.findByPk(nuevoPago.id, {
      include: [
        { model: Paciente, attributes: ['nombre_paciente', 'apellido_paciente'] }
      ]
    });

    const pagoDTO = mapPagoToDTO(pagoConAsociaciones);
    if (cod_medico) {
      try {
        const medico = await Doctor.findByPk(cod_medico);
        if (medico) {
          pagoDTO.medico = `Dr. ${medico.nombre_doctor} ${medico.apellido_doctor}`;
        }
      } catch (error) {
        console.log('No se pudo encontrar el médico:', error);
      }
    }

    res.status(201).json({
      message: 'Pago creado correctamente',
      pago: pagoDTO
    });
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ message: 'Error al crear pago', error: error.message });
  }
};

// PUT /api/pagos/:id
exports.actualizarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { cod_paciente, cod_medico, monto, fecha, id_servicio, id_tipo_pago, id_usuario } = req.body;

    console.log('📝 Actualizando pago:', { id, cod_paciente, cod_medico, monto, fecha });

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    await pago.update({
      cod_paciente: cod_paciente ?? pago.cod_paciente,
      id_servicio: id_servicio ?? pago.id_servicio,
      id_tipo_pago: id_tipo_pago ?? pago.id_tipo_pago,
      monto: monto ?? pago.monto,
      fecha_pago: fecha ?? pago.fecha_pago,
      id_usuario: id_usuario ?? pago.id_usuario
    });

    const pagoActualizado = await Pago.findByPk(id, {
      include: [
        { model: Paciente, attributes: ['nombre_paciente', 'apellido_paciente'] }
      ]
    });

    const pagoDTO = mapPagoToDTO(pagoActualizado);
    if (cod_medico) {
      try {
        const medico = await Doctor.findByPk(cod_medico);
        if (medico) {
          pagoDTO.medico = `Dr. ${medico.nombre_doctor} ${medico.apellido_doctor}`;
        }
      } catch (error) {
        console.log('No se pudo encontrar el médico:', error);
      }
    }

    res.json({
      message: 'Pago actualizado correctamente',
      pago: pagoDTO
    });
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    res.status(500).json({ message: 'Error al actualizar pago', error: error.message });
  }
};

// DELETE /api/pagos/:id
exports.eliminarPago = async (req, res) => {
  try {
    const { id } = req.params;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    await pago.destroy();
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    res.status(500).json({ message: 'Error al eliminar pago', error: error.message });
  }
};
