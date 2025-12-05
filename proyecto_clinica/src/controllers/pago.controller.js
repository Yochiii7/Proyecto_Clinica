import { Cita, Paciente, Doctor, Especialidad, Pago, Precio } from '../models/index.js';

// Crear un pago para una cita
export const crearPago = async (req, res) => {
  try {
    console.log("🟡 Creando pago para cita...");
    const { cod_cita, monto, metodo_pago, referencia } = req.body;

    console.log("📥 Datos recibidos:", req.body);

    if (!cod_cita || !monto || !metodo_pago) {
      return res.status(400).json({ message: "Faltan datos obligatorios (cita, monto, método de pago)." });
    }

    // Verificar que la cita existe
    const cita = await Cita.findByPk(cod_cita, {
      include: [
        { model: Paciente, attributes: ['nombre_paciente', 'apellido_paciente'] },
        { model: Doctor, attributes: ['nombre_doctor', 'apellido_doctor'] },
        { model: Especialidad, attributes: ['nombre_especialidad'] }
      ]
    });

    if (!cita) {
      return res.status(404).json({ message: "❌ La cita no existe." });
    }

    // Ya no verificamos pago existente para permitir múltiples pagos parciales

    // Crear el pago
    const nuevoPago = await Pago.create({
      cod_cita,
      monto,
      metodo_pago,
      referencia,
      estado_pago: 'completado'
    });

    console.log("✅ Pago creado exitosamente. ID:", nuevoPago.cod_pago);

    res.status(201).json({
      message: "✅ Pago registrado correctamente.",
      pago: {
        id: nuevoPago.cod_pago,
        cod_cita: nuevoPago.cod_cita,
        monto: nuevoPago.monto,
        metodo_pago: nuevoPago.metodo_pago,
        estado_pago: nuevoPago.estado_pago,
        referencia: nuevoPago.referencia,
        fecha_pago: nuevoPago.fecha_pago,
        cita: {
          paciente: cita.Paciente ? 
            `${cita.Paciente.nombre_paciente} ${cita.Paciente.apellido_paciente}` : 
            `Paciente #${cita.cod_paciente}`,
          doctor: cita.Doctor ? 
            `${cita.Doctor.nombre_doctor} ${cita.Doctor.apellido_doctor}` : 
            `Doctor #${cita.cod_doctor}`,
          especialidad: cita.Especialidad ? cita.Especialidad.nombre_especialidad : 'N/A',
          fecha: cita.fecha,
          hora: cita.hora
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Error al crear el pago:", error);
    res.status(500).json({ 
      message: "Error al crear el pago.",
      error: error.message 
    });
  }
};

// Obtener resumen de pagos por cita
export const obtenerResumenPagosPorCita = async (req, res) => {
  try {
    const { cod_cita } = req.params;

    const cita = await Cita.findByPk(cod_cita, {
      include: [
        { model: Especialidad, attributes: ['nombre_especialidad'] }
      ]
    });

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada." });
    }

    // Obtener precio base de la especialidad
    const precio = await Precio.findOne({
      where: { cod_especialidad: cita.cod_especialidad, estado: 'activo' }
    });

    const monto_total = precio ? precio.monto_base : 150.00; // Precio por defecto

    // Obtener todos los pagos de la cita
    const pagos = await Pago.findAll({
      where: { cod_cita },
      order: [['fecha_pago', 'ASC']]
    });

    const total_pagado = pagos.reduce((sum, pago) => sum + parseFloat(pago.monto), 0);
    const saldo_pendiente = Math.max(0, monto_total - total_pagado);
    const estado_completo = saldo_pendiente <= 0;

    res.json({
      cita: {
        id: cita.cod_cita,
        especialidad: cita.Especialidad ? cita.Especialidad.nombre_especialidad : 'N/A',
        fecha: cita.fecha,
        hora: cita.hora
      },
      monto_total,
      total_pagado,
      saldo_pendiente,
      estado_completo,
      pagos: pagos.map(pago => ({
        id: pago.cod_pago,
        monto: pago.monto,
        metodo_pago: pago.metodo_pago,
        estado_pago: pago.estado_pago,
        referencia: pago.referencia,
        fecha_pago: pago.fecha_pago
      }))
    });
    
  } catch (error) {
    console.error("❌ Error al obtener resumen de pagos:", error);
    res.status(500).json({ 
      message: "Error al obtener resumen de pagos.",
      error: error.message 
    });
  }
};

// Obtener pago por ID de cita
export const obtenerPagoPorCita = async (req, res) => {
  try {
    const { cod_cita } = req.params;

    const pago = await Pago.findOne({
      where: { cod_cita },
      include: [{
        model: Cita,
        include: [
          { model: Paciente, attributes: ['nombre_paciente', 'apellido_paciente'] },
          { model: Doctor, attributes: ['nombre_doctor', 'apellido_doctor'] },
          { model: Especialidad, attributes: ['nombre_especialidad'] }
        ]
      }]
    });

    if (!pago) {
      return res.status(404).json({ message: "No se encontró pago para esta cita." });
    }

    res.json(pago);
    
  } catch (error) {
    console.error("❌ Error al obtener pago:", error);
    res.status(500).json({ 
      message: "Error al obtener el pago.",
      error: error.message 
    });
  }
};

// Listar todos los pagos
export const listarPagos = async (req, res) => {
  try {
    console.log("🟡 Listando todos los pagos...");
    
    const pagos = await Pago.findAll({
      include: [{
        model: Cita,
        include: [
          { model: Paciente, attributes: ['nombre_paciente', 'apellido_paciente'] },
          { model: Doctor, attributes: ['nombre_doctor', 'apellido_doctor'] },
          { model: Especialidad, attributes: ['nombre_especialidad'] }
        ]
      }],
      order: [['fecha_pago', 'DESC']]
    });

    const pagosFormateados = pagos.map(pago => ({
      id: pago.cod_pago,
      cod_cita: pago.cod_cita,
      monto: pago.monto,
      metodo_pago: pago.metodo_pago,
      estado_pago: pago.estado_pago,
      referencia: pago.referencia,
      fecha_pago: pago.fecha_pago,
      cita: pago.Cita ? {
        paciente: pago.Cita.Paciente ? 
          `${pago.Cita.Paciente.nombre_paciente} ${pago.Cita.Paciente.apellido_paciente}` : 
          `Paciente #${pago.Cita.cod_paciente}`,
        doctor: pago.Cita.Doctor ? 
          `${pago.Cita.Doctor.nombre_doctor} ${pago.Cita.Doctor.apellido_doctor}` : 
          `Doctor #${pago.Cita.cod_doctor}`,
        especialidad: pago.Cita.Especialidad ? pago.Cita.Especialidad.nombre_especialidad : 'N/A',
        fecha: pago.Cita.fecha,
        hora: pago.Cita.hora,
        estado: pago.Cita.estado
      } : null
    }));

    res.json(pagosFormateados);
    
  } catch (error) {
    console.error("❌ Error al listar los pagos:", error);
    res.status(500).json({ 
      message: "Error al listar los pagos.",
      error: error.message 
    });
  }
};

// Actualizar estado de pago
export const actualizarEstadoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_pago } = req.body;

    if (!['pendiente', 'completado', 'rechazado'].includes(estado_pago)) {
      return res.status(400).json({ message: "Estado de pago no válido." });
    }

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado." });
    }

    await pago.update({ estado_pago });
    
    res.json({ 
      message: "✅ Estado del pago actualizado correctamente.", 
      pago: {
        id: pago.cod_pago,
        estado_pago: pago.estado_pago
      }
    });
    
  } catch (error) {
    console.error("❌ Error al actualizar estado del pago:", error);
    res.status(500).json({ 
      message: "Error al actualizar estado del pago.",
      error: error.message 
    });
  }
};

// Eliminar pago
export const eliminarPago = async (req, res) => {
  try {
    const { id } = req.params;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado." });
    }

    await pago.destroy();
    res.json({ message: "🗑️ Pago eliminado correctamente." });
    
  } catch (error) {
    console.error("❌ Error al eliminar el pago:", error);
    res.status(500).json({ 
      message: "Error al eliminar el pago.",
      error: error.message 
    });
  }
};
