const Paciente = require('../models/Paciente');

// Listar todos
exports.obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({ order: [['nombre_paciente', 'ASC']] });
    res.json(pacientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};

// Crear nuevo
exports.crearPaciente = async (req, res) => {
  try {
    const {
      cedula_paciente,
      nombre_paciente,
      apellido_paciente,
      sexo,
      telefono,
      seguro,
      estado,
      cargo
    } = req.body;

    // Validaciones básicas
    if (!cedula_paciente || !nombre_paciente || !apellido_paciente || !sexo) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    // Verificar duplicado por cédula
    const existe = await Paciente.findOne({ where: { cedula_paciente } });
    if (existe) return res.status(409).json({ mensaje: 'Ya existe un paciente con esa cédula' });

    const nuevo = await Paciente.create({
      cedula_paciente,
      nombre_paciente,
      apellido_paciente,
      sexo,
      telefono: telefono || null,
      seguro: seguro || null,
      estado: estado || 'Activo',
      cargo: cargo || 'P'
    });

    res.status(201).json({ mensaje: 'Paciente registrado correctamente', paciente: nuevo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear paciente' });
  }
};

// Actualizar por cedula
exports.actualizarPaciente = async (req, res) => {
  try {
    const { cedula_paciente } = req.params;
    const { nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado } = req.body;

    const paciente = await Paciente.findOne({ where: { cedula_paciente } });
    if (!paciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });

    await paciente.update({ nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado });
    res.json({ mensaje: 'Paciente actualizado correctamente', paciente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar paciente' });
  }
};

// Eliminar por cedula
exports.eliminarPaciente = async (req, res) => {
  try {
    const { cedula_paciente } = req.params;
    const paciente = await Paciente.findOne({ where: { cedula_paciente } });
    if (!paciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });

    await paciente.destroy();
    res.json({ mensaje: 'Paciente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar paciente' });
  }
};
