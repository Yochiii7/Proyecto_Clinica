const Especialidad = require('../models/Especialidad');

exports.obtenerEspecialidades = async (req, res) => {
  try {
    const list = await Especialidad.findAll({ order: [['nombre_especialidad', 'ASC']] });
    res.json(list);
  } catch (error) {
    console.error('Error obtenerEspecialidades:', error);
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
};

exports.crearEspecialidad = async (req, res) => {
  try {
    const { nombre_especialidad } = req.body;
    if (!nombre_especialidad) return res.status(400).json({ mensaje: 'Falta nombre' });
    const nueva = await Especialidad.create({ nombre_especialidad });
    res.status(201).json({ mensaje: 'Especialidad creada', especialidad: nueva });
  } catch (error) {
    console.error('Error crearEspecialidad:', error);
    res.status(500).json({ error: 'Error al crear especialidad' });
  }
};
