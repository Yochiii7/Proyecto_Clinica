import { Cita, Paciente, Doctor, Especialidad, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

//Crear una cita
export const crearCita = async (req, res) => {
  try {
    console.log("🟡 Creando cita en la BD...");
    const { fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado } = req.body;

    console.log("📥 Datos recibidos:", req.body);

    
    if (!fecha || !hora || !cod_paciente || !cod_doctor || !cod_especialidad) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    
    const paciente = await Paciente.findByPk(cod_paciente);
    if (!paciente) {
      return res.status(400).json({ message: "❌ El paciente no existe." });
    }

    const doctor = await Doctor.findByPk(cod_doctor);
    if (!doctor) {
      return res.status(400).json({ message: "❌ El doctor no existe." });
    }

    const especialidad = await Especialidad.findByPk(cod_especialidad);
    if (!especialidad) {
      return res.status(400).json({ message: "❌ La especialidad no existe." });
    }

    console.log("✅ Validaciones pasadas, creando cita...");

    // CREAR LA CITA EN LA BD
    const nuevaCita = await Cita.create({
      fecha,
      hora,
      cod_paciente,
      cod_doctor,
      cod_especialidad,
      estado: estado || "P"
    });

    console.log("✅ Cita creada exitosamente. ID:", nuevaCita.cod_cita);

    //RESPUESTA MEJORADA CON NOMBRES
    res.status(201).json({
      message: "✅ Cita registrada correctamente en la BD.",
      cita: {
        id: nuevaCita.cod_cita,
        fecha: nuevaCita.fecha,
        hora: nuevaCita.hora,
        paciente: `${paciente.nombre_paciente} ${paciente.apellido_paciente}`,
        cod_paciente: nuevaCita.cod_paciente,
        doctor: `${doctor.nombre_doctor} ${doctor.apellido_doctor}`,
        cod_doctor: nuevaCita.cod_doctor,
        especialidad: especialidad.nombre_especialidad,
        cod_especialidad: nuevaCita.cod_especialidad,
        estado: nuevaCita.estado,
        fecha_creacion: nuevaCita.fecha_creacion
      }
    });
    
  } catch (error) {
    console.error("❌ Error al crear la cita:", error);
    res.status(500).json({ 
      message: "Error al crear la cita.",
      error: error.message 
    });
  }
};

//Listar todas las citas con nombres completos
export const listarCitas = async (req, res) => {
  try {
    console.log("🟡 Listando todas las citas con información completa...");
    
    const citas = await Cita.findAll({
      include: [
        {
          model: Paciente,
          attributes: ['nombre_paciente', 'apellido_paciente']
        },
        {
          model: Doctor, 
          attributes: ['nombre_doctor', 'apellido_doctor']
        },
        {
          model: Especialidad,
          attributes: ['nombre_especialidad']
        }
      ],
      order: [['fecha', 'DESC'], ['hora', 'ASC']]
    });
    
    console.log(`✅ ${citas.length} citas encontradas`);

    // Re-evaluar y marcar como 'Atendido' las citas cuya fecha+hora ya pasó
    try {
      const now = new Date()
      const toUpdate = []
      for (const cita of citas) {
        const fecha = cita.fecha // DATEONLY 'YYYY-MM-DD'
        let hora = cita.hora || '00:00:00'
        // asegurar formato HH:mm:ss
        if (hora.split(':').length === 2) hora = hora + ':00'

        // construir fecha completa ISO local
        const dt = new Date(`${fecha}T${hora}`)

        // Solo actualizamos si la cita ya pasó, y no está marcada como Atendido (A) ni Cancelado (C)
        if (dt < now && cita.estado !== 'A' && cita.estado !== 'C') {
          toUpdate.push(cita)
        }
      }

      if (toUpdate.length > 0) {
        console.log(`🔁 Marcando ${toUpdate.length} citas como 'Atendido' porque su fecha+hora ya pasó`)
        await Promise.all(toUpdate.map(c => c.update({ estado: 'A' })))
      }
    } catch (err) {
      console.warn('⚠️ Error re-evaluando estados de citas (no bloqueante):', err.message || err)
    }
    
    // Formatear la respuesta para mostrar nombres en lugar de códigos
    const citasFormateadas = citas.map(cita => ({
      id: cita.cod_cita,
      fecha: cita.fecha,
      hora: cita.hora,
      paciente: cita.Paciente ? 
        `${cita.Paciente.nombre_paciente} ${cita.Paciente.apellido_paciente}` : 
        `Paciente #${cita.cod_paciente}`,
      cod_paciente: cita.cod_paciente,
      doctor: cita.Doctor ? 
        `${cita.Doctor.nombre_doctor} ${cita.Doctor.apellido_doctor}` : 
        `Doctor #${cita.cod_doctor}`,
      cod_doctor: cita.cod_doctor,
      especialidad: cita.Especialidad ? 
        cita.Especialidad.nombre_especialidad : 
        `Especialidad #${cita.cod_especialidad}`,
      cod_especialidad: cita.cod_especialidad,
      estado: cita.estado,
      fecha_creacion: cita.fecha_creacion
    }));

    res.json(citasFormateadas);
    
  } catch (error) {
    console.error("❌ Error al listar las citas:", error);
    
    if (error.message.includes('associated')) {
      console.log("⚠️  Usando versión simple (sin asociaciones)");
      const citasSimples = await Cita.findAll({
        order: [['fecha', 'DESC'], ['hora', 'ASC']]
      });
      res.json(citasSimples);
    } else {
      res.status(500).json({ 
        message: "Error al listar las citas.",
        error: error.message 
      });
    }
  }
};

// Reporte: Buscar citas por rango de fechas (inclusive)
export const reporteCitasPorFechas = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta, filter_by } = req.query;

    if (!fecha_desde || !fecha_hasta) {
      return res.status(400).json({ message: 'Parámetros fecha_desde y fecha_hasta son obligatorios.' });
    }

    // Elegir campo por el que filtrar: por defecto usamos 'fecha_creacion' (registro)
    // para mantener compatibilidad, si client pide 'fecha' explícitamente usaremos la fecha de la cita.
    const field = (filter_by === 'fecha') ? 'fecha' : 'fecha_creacion'

    // Buscar citas cuya fecha esté entre ambos valores (inclusive)
    let whereClause
    if (field === 'fecha') {
      // fecha es DATEONLY -> comparar por días directamente
      whereClause = { fecha: { [Op.between]: [fecha_desde, fecha_hasta] } }
    } else {
      // fecha_creacion es DATETIME -> convertir el rango a timestampts inclusivos
      const desdeTs = `${fecha_desde} 00:00:00`
      const hastaTs = `${fecha_hasta} 23:59:59`
      whereClause = { fecha_creacion: { [Op.between]: [desdeTs, hastaTs] } }
    }

    const citas = await Cita.findAll({
      where: whereClause,
      include: [
        { model: Paciente, attributes: ['nombre_paciente', 'apellido_paciente'] },
        { model: Doctor, attributes: ['nombre_doctor', 'apellido_doctor'] },
        { model: Especialidad, attributes: ['nombre_especialidad'] }
      ],
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    const citasFormateadas = citas.map(cita => ({
      id: cita.cod_cita,
      fecha: cita.fecha,
      hora: cita.hora,
      paciente: cita.Paciente ? `${cita.Paciente.nombre_paciente} ${cita.Paciente.apellido_paciente}` : `Paciente #${cita.cod_paciente}`,
      cod_paciente: cita.cod_paciente,
      doctor: cita.Doctor ? `${cita.Doctor.nombre_doctor} ${cita.Doctor.apellido_doctor}` : `Doctor #${cita.cod_doctor}`,
      cod_doctor: cita.cod_doctor,
      especialidad: cita.Especialidad ? cita.Especialidad.nombre_especialidad : `Especialidad #${cita.cod_especialidad}`,
      cod_especialidad: cita.cod_especialidad,
      estado: cita.estado,
      fecha_creacion: cita.fecha_creacion
    }));

    res.json(citasFormateadas);
  } catch (error) {
    console.error('❌ Error generando reporte por fechas:', error);
    res.status(500).json({ message: 'Error generando reporte por fechas.', error: error.message });
  }
};

// Reporte: Ranking de pacientes por número de visitas
export const rankingPacientesPorVisitas = async (req, res) => {
  try {
    // Agrupar por cod_paciente y contar citas
    const results = await Cita.findAll({
      attributes: [
        'cod_paciente',
        [sequelize.fn('COUNT', sequelize.col('cod_cita')), 'total_citas']
      ],
      include: [{ model: Paciente, attributes: ['nombre_paciente', 'apellido_paciente'] }],
      group: ['cod_paciente', 'Paciente.cod_paciente'],
      order: [[sequelize.literal('total_citas'), 'DESC']]
    });

    const ranking = results.map(r => ({
      paciente: r.Paciente ? `${r.Paciente.nombre_paciente} ${r.Paciente.apellido_paciente}` : `Paciente #${r.cod_paciente}`,
      total_citas: Number(r.dataValues.total_citas || 0)
    }));

    res.json(ranking);
  } catch (error) {
    console.error('❌ Error generando ranking de pacientes:', error);
    res.status(500).json({ message: 'Error generando ranking de pacientes.', error: error.message });
  }
};

// Reporte: Ranking de especialidades por número de solicitudes/citas
export const rankingEspecialidadesPorSolicitudes = async (req, res) => {
  try {
    // Agrupar por cod_especialidad y contar citas
    const results = await Cita.findAll({
      attributes: [
        'cod_especialidad',
        [sequelize.fn('COUNT', sequelize.col('cod_cita')), 'total_solicitudes']
      ],
      include: [{ model: Especialidad, attributes: ['nombre_especialidad'] }],
      group: ['cod_especialidad', 'Especialidad.cod_especialidad'],
      order: [[sequelize.literal('total_solicitudes'), 'DESC']]
    });

    const ranking = results.map(r => ({
      especialidad: r.Especialidad ? r.Especialidad.nombre_especialidad : `Especialidad #${r.cod_especialidad}`,
      total_solicitudes: Number(r.dataValues.total_solicitudes || 0)
    }));

    res.json(ranking);
  } catch (error) {
    console.error('❌ Error generando ranking de especialidades:', error);
    res.status(500).json({ message: 'Error generando ranking de especialidades.', error: error.message });
  }
};

//Actualizar cita
export const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado } = req.body;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada." });
    }

    await cita.update({ fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado });
    res.json({ message: "✅ Cita actualizada correctamente.", cita });
  } catch (error) {
    console.error("❌ Error al actualizar la cita:", error);
    res.status(500).json({ message: "Error al actualizar la cita." });
  }
};

//Eliminar cita
export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada." });
    }

    await cita.destroy();
    res.json({ message: "🗑️ Cita eliminada correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar la cita:", error);
    res.status(500).json({ message: "Error al eliminar la cita." });
  }
};