import { Cita, Paciente, Doctor, Especialidad } from '../models/index.js';

//Crear una cita
export const crearCita = async (req, res) => {
  try {
    console.log("🟡 Creando cita en la BD...");
    const { fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado } = req.body;

    console.log("📥 Datos recibidos:", req.body);

    // Validaciones básicas
    if (!fecha || !hora || !cod_paciente || !cod_doctor || !cod_especialidad) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // Verificar que existen los registros relacionados
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
        doctor: `${doctor.nombre_doctor} ${doctor.apellido_doctor}`,
        especialidad: especialidad.nombre_especialidad,
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
    
    // Formatear la respuesta para mostrar nombres en lugar de códigos
    const citasFormateadas = citas.map(cita => ({
      id: cita.cod_cita,
      fecha: cita.fecha,
      hora: cita.hora,
      paciente: cita.Paciente ? 
        `${cita.Paciente.nombre_paciente} ${cita.Paciente.apellido_paciente}` : 
        `Paciente #${cita.cod_paciente}`,
      doctor: cita.Doctor ? 
        `${cita.Doctor.nombre_doctor} ${cita.Doctor.apellido_doctor}` : 
        `Doctor #${cita.cod_doctor}`,
      especialidad: cita.Especialidad ? 
        cita.Especialidad.nombre_especialidad : 
        `Especialidad #${cita.cod_especialidad}`,
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