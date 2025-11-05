import { Cita } from "../models/cita.model.js";

// ✅ Crear una cita
export const crearCita = async (req, res) => {
  try {
    const { fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado } = req.body;

    if (!fecha || !hora || !cod_paciente || !cod_doctor || !cod_especialidad) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const nuevaCita = await Cita.create({
      fecha,
      hora,
      cod_paciente,
      cod_doctor,
      cod_especialidad,
      estado: estado || "P"
    });

    res.status(201).json({
      message: "✅ Cita registrada correctamente.",
      cita: nuevaCita
    });
  } catch (error) {
    console.error("❌ Error al crear la cita:", error);
    res.status(500).json({ message: "Error al crear la cita." });
  }
};

// 📋 Listar todas las citas
export const listarCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll();
    res.json(citas);
  } catch (error) {
    console.error("❌ Error al listar las citas:", error);
    res.status(500).json({ message: "Error al listar las citas." });
  }
};

// ✏️ Editar una cita por ID
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

// 🗑️ Eliminar una cita por ID
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
