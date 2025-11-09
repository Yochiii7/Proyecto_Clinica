const Servicio = require('../models/Servicio');
const Doctor = require('../models/Doctor'); // Necesario para el 'include'

// Listar todos (READ) - ¡CON JOIN!
exports.obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({
      order: [['nombre_servicio', 'ASC']],
      
      // CAMBIO: Incluimos los datos del doctor asociado
      include: {
        model: Doctor,
        as: 'doctor', // El 'as' que definimos en la asociación
        attributes: ['nombre_doctor', 'apellido_doctor'] // Trae solo los campos que necesitas
      }
    });
    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

// Crear nuevo (CREATE)
exports.crearServicio = async (req, res) => {
  try {
    // CAMBIO: Recibimos 'cod_doctor' en lugar de 'medico_responsable'
    const { nombre_servicio, precio, cod_doctor } = req.body;

    if (!nombre_servicio || !precio) {
      return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
    }

    const nuevo = await Servicio.create({
      nombre_servicio,
      precio,
      cod_doctor: cod_doctor || null // Acepta nulos si no se envía
    });

    res.status(201).json({ mensaje: 'Servicio registrado correctamente', servicio: nuevo });
  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
};

// Actualizar por ID (UPDATE)
exports.actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    // CAMBIO: Recibimos 'cod_doctor'
    const { nombre_servicio, precio, cod_doctor } = req.body;

    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado' });

    await servicio.update({ 
      nombre_servicio, 
      precio, 
      cod_doctor: cod_doctor || null
    });
    
    res.json({ mensaje: 'Servicio actualizado correctamente', servicio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
};

// Eliminar por ID (DELETE)
exports.eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado' });

    await servicio.destroy();
    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};