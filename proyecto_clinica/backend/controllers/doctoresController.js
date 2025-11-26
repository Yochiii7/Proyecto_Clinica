const Doctor = require('../models/Doctor');

// Listar todos
exports.obtenerDoctores = async (req, res) => {
  try {
    const doctores = await Doctor.findAll({ order: [['nombre_doctor', 'ASC']] });
    res.json(doctores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener doctores' });
  }
};

// Crear nuevo
exports.crearDoctor = async (req, res) => {
  try {
    const {
      dni_doctor,
      nombre_doctor,
      apellido_doctor,
      sexo,
      telefono,
      fecha_nacimiento, // Nuevo
      correo,           // Nuevo
      nacionalidad,     // Nuevo
      estado
    } = req.body;

    // Validaciones
    if (!dni_doctor || !nombre_doctor || !apellido_doctor || !sexo || !fecha_nacimiento || !correo) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const existe = await Doctor.findOne({ where: { dni_doctor } });
    if (existe) return res.status(409).json({ mensaje: 'Ya existe un doctor con ese DNI' });

    const nuevo = await Doctor.create({
      dni_doctor,
      nombre_doctor,
      apellido_doctor,
      sexo,
      telefono: telefono || null,
      fecha_nacimiento,
      correo,
      nacionalidad: nacionalidad || 'Venezolano(a)',
      estado: estado || 'Activo'
    });

    res.status(201).json({ mensaje: 'Doctor registrado correctamente', doctor: nuevo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear doctor' });
  }
};

// Actualizar por DNI
exports.actualizarDoctor = async (req, res) => {
  try {
    const { dni_doctor } = req.params;
    const { nombre_doctor, apellido_doctor, sexo, telefono, fecha_nacimiento, correo, nacionalidad, estado } = req.body;

    const doctor = await Doctor.findOne({ where: { dni_doctor } });
    if (!doctor) return res.status(404).json({ mensaje: 'Doctor no encontrado' });

    await doctor.update({ 
      nombre_doctor, 
      apellido_doctor, 
      sexo, 
      telefono, 
      fecha_nacimiento, 
      correo, 
      nacionalidad, 
      estado 
    });
    res.json({ mensaje: 'Doctor actualizado correctamente', doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar doctor' });
  }
};

// Eliminar por DNI
exports.eliminarDoctor = async (req, res) => {
  try {
    const { dni_doctor } = req.params;
    const doctor = await Doctor.findOne({ where: { dni_doctor } });
    if (!doctor) return res.status(404).json({ mensaje: 'Doctor no encontrado' });

    await doctor.destroy();
    res.json({ mensaje: 'Doctor eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar doctor' });
  }
};