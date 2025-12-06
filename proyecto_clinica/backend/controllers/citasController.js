const db = require('../config/db');
const Cita = require('../models/Cita');

// Obtener todas las citas con información relacionada (paciente, doctor, especialidad)
exports.obtenerCitas = async (req, res) => {
  try {
    const query = `
      SELECT c.cod_cita AS id,
             c.fecha AS fecha,
             c.hora AS hora,
             COALESCE(p.nombre_paciente, p.nombre) AS paciente,
             COALESCE(d.nombre_doctor, d.nombre) AS doctor,
             e.nombre_especialidad AS especialidad,
             c.estado AS estado,
             c.fecha_creacion AS fecha_creacion,
             c.cod_paciente,
             c.cod_doctor,
             c.cod_especialidad
      FROM cita c
      LEFT JOIN pacientes p ON c.cod_paciente = p.cod_paciente
      LEFT JOIN doctores d ON c.cod_doctor = d.cod_doctor
      LEFT JOIN especialidad e ON c.cod_especialidad = e.cod_especialidad
      ORDER BY c.fecha DESC, c.hora DESC
    `;
    const [rows] = await db.query(query, { raw: true });
    res.json(rows);
  } catch (error) {
    console.error('Error obtenerCitas:', error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

// Crear cita
exports.crearCita = async (req, res) => {
  try {
    const { fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado } = req.body;
    if (!fecha || !hora || !cod_paciente) return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    const nueva = await Cita.create({ fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado: estado || 'P' });
    res.status(201).json({ mensaje: 'Cita creada', cita: nueva });
  } catch (error) {
    console.error('Error crearCita:', error);
    res.status(500).json({ error: 'Error al crear cita' });
  }
};

// Actualizar cita
exports.actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado } = req.body;
    const cita = await Cita.findOne({ where: { cod_cita: id } });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    await cita.update({ fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado });
    res.json({ mensaje: 'Cita actualizada', cita });
  } catch (error) {
    console.error('Error actualizarCita:', error);
    res.status(500).json({ error: 'Error al actualizar cita' });
  }
};

// Eliminar cita
exports.eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findOne({ where: { cod_cita: id } });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    await cita.destroy();
    res.json({ mensaje: 'Cita eliminada' });
  } catch (error) {
    console.error('Error eliminarCita:', error);
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
};

// Reporte por fechas
exports.reportePorFechas = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta, filter_by } = req.query;
    if (!fecha_desde || !fecha_hasta) return res.status(400).json({ mensaje: 'Faltan fechas' });
    // filter_by: 'fecha' (por defecto) o 'fecha_creacion'
    const column = filter_by === 'fecha_creacion' ? 'c.fecha_creacion' : 'c.fecha';
    const query = `
      SELECT c.cod_cita AS id,
             c.fecha AS fecha,
             c.hora AS hora,
             COALESCE(p.nombre_paciente, p.nombre) AS paciente,
             COALESCE(d.nombre_doctor, d.nombre) AS doctor,
             e.nombre_especialidad AS especialidad,
             c.estado AS estado,
             c.fecha_creacion AS fecha_creacion
      FROM cita c
      LEFT JOIN pacientes p ON c.cod_paciente = p.cod_paciente
      LEFT JOIN doctores d ON c.cod_doctor = d.cod_doctor
      LEFT JOIN especialidad e ON c.cod_especialidad = e.cod_especialidad
      WHERE DATE(${column}) BETWEEN ? AND ?
      ORDER BY ${column} DESC
    `;
    const [rows] = await db.query(query, { replacements: [fecha_desde, fecha_hasta] });
    res.json(rows);
  } catch (error) {
    console.error('Error reportePorFechas:', error);
    res.status(500).json({ error: 'Error generando reporte' });
  }
};

// Ranking de pacientes
exports.reporteRankingPacientes = async (req, res) => {
  try {
    const query = `
      SELECT COALESCE(p.nombre_paciente, p.nombre) AS paciente,
             COUNT(*) AS total_citas
      FROM cita c
      LEFT JOIN pacientes p ON c.cod_paciente = p.cod_paciente
      GROUP BY c.cod_paciente
      ORDER BY total_citas DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error reporteRankingPacientes:', error);
    res.status(500).json({ error: 'Error generando ranking de pacientes' });
  }
};

// Ranking de especialidades
exports.reporteRankingEspecialidades = async (req, res) => {
  try {
    const query = `
      SELECT e.nombre_especialidad AS especialidad,
             COUNT(*) AS total_solicitudes
      FROM cita c
      LEFT JOIN especialidad e ON c.cod_especialidad = e.cod_especialidad
      GROUP BY c.cod_especialidad
      ORDER BY total_solicitudes DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error reporteRankingEspecialidades:', error);
    res.status(500).json({ error: 'Error generando ranking de especialidades' });
  }
};
