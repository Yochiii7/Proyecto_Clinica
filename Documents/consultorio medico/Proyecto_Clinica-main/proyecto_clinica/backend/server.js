// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// --- 1. IMPORTAR RUTAS ---
const authRoutes = require('./routes/auth'); // Ruta de Login/Registro
const pacientesRoutes = require('./routes/pacientes');
const facturasRoutes = require('./routes/facturas');
const servicioRoutes = require('./routes/servicios');
const doctorRoutes = require('./routes/doctores');

// --- 2. CONFIGURACIÓN INICIAL ---
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors()); // Permitir conexiones desde Vue
app.use(express.json()); // Permitir leer JSON en los request

// --- 3. DEFINIR ENDPOINTS (USAR RUTAS) ---

// Autenticación (Login y Registro)
app.use('/api/auth', authRoutes);

// Módulos del sistema
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/doctores', doctorRoutes);

// Endpoint para obtener especialidades (ligero, usa la tabla 'especialidad')
app.get('/api/especialidades', async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT cod_especialidad, COALESCE(nombre_especialidad, '') AS nombre FROM especialidad ORDER BY nombre_especialidad"
    );
    console.log(`/api/especialidades -> rows: ${Array.isArray(results) ? results.length : 0}`);
    res.json(results);
  } catch (error) {
    console.error('Error al listar especialidades:', error);
    res.status(500).json({ message: 'Error al listar especialidades.' });
  }
});

// Endpoint temporal de diagnóstico: devuelve especialidades de ejemplo
app.get('/api/especialidades/sample', (req, res) => {
  const sample = [
    { cod_especialidad: 1, nombre: 'Medicina General' },
    { cod_especialidad: 2, nombre: 'Pediatría' }
  ];
  res.json(sample);
});

// -------------------------------------------------------------------
// Rutas básicas para 'citas' (CRUD) implementadas aquí en CommonJS
// Esto evita mezclar formatos (ESM/CJS) y garantiza que la ruta
// `GET /api/citas` esté disponible si se ejecuta este servidor.
// -------------------------------------------------------------------
app.get('/api/citas', async (req, res) => {
  try {
    // Seleccionamos las columnas más relevantes y traemos nombres de paciente y doctor
    const [results] = await db.query(
      `SELECT
         c.cod_cita AS id,
         c.fecha AS fecha,
         c.hora AS hora,
         c.cod_paciente,
         CONCAT(IFNULL(p.nombre_paciente, ''), ' ', IFNULL(p.apellido_paciente, '')) AS paciente,
         c.cod_doctor,
         CONCAT(IFNULL(d.nombre_doctor, ''), ' ', IFNULL(d.apellido_doctor, '')) AS doctor,
         c.cod_especialidad,
         COALESCE(e.nombre_especialidad, '') AS especialidad,
         c.estado,
         c.fecha_creacion
       FROM cita c
       LEFT JOIN pacientes p ON c.cod_paciente = p.cod_paciente
       LEFT JOIN doctores d ON c.cod_doctor = d.cod_doctor`
      + "\n        LEFT JOIN especialidad e ON c.cod_especialidad = e.cod_especialidad"
    );
    res.json(results);
  } catch (error) {
    console.error('Error al listar citas (ruta directa):', error);
    res.status(500).json({ message: 'Error al listar las citas.' });
  }
});

app.post('/api/citas', async (req, res) => {
  try {
    const { fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado } = req.body;
    if (!fecha || !hora || !cod_paciente || !cod_doctor || !cod_especialidad) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    const [result] = await db.query(
      'INSERT INTO cita (fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      { replacements: [fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado || 'P'] }
    );
    // MySQL returns insertId
    const insertId = result && result.insertId ? result.insertId : null;
    res.status(201).json({ message: '✅ Cita registrada correctamente.', id: insertId });
  } catch (error) {
    console.error('Error al crear cita (ruta directa):', error);
    res.status(500).json({ message: 'Error al crear la cita.' });
  }
});

app.put('/api/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado } = req.body;
    const [result] = await db.query(
      'UPDATE cita SET fecha = ?, hora = ?, cod_paciente = ?, cod_doctor = ?, cod_especialidad = ?, estado = ? WHERE cod_cita = ?',
      { replacements: [fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado || 'P', id] }
    );
    // result.affectedRows puede indicar si se actualizó
    res.json({ message: '✅ Cita actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar cita (ruta directa):', error);
    res.status(500).json({ message: 'Error al actualizar la cita.' });
  }
});

app.delete('/api/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM cita WHERE cod_cita = ?', { replacements: [id] });
    res.json({ message: '🗑️ Cita eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar cita (ruta directa):', error);
    res.status(500).json({ message: 'Error al eliminar la cita.' });
  }
});

// ------------------ Endpoints de reportes ------------------
// Ranking de pacientes por número de citas
app.get('/api/citas/reporte/ranking-pacientes', async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT
         c.cod_paciente,
         CONCAT(IFNULL(p.nombre_paciente, ''), ' ', IFNULL(p.apellido_paciente, '')) AS paciente,
         COUNT(*) AS total_citas
       FROM cita c
       LEFT JOIN pacientes p ON c.cod_paciente = p.cod_paciente
       GROUP BY c.cod_paciente
       ORDER BY total_citas DESC`
    );
    res.json(results);
  } catch (error) {
    console.error('Error en ranking-pacientes:', error);
    res.status(500).json({ message: 'Error al generar ranking de pacientes.' });
  }
});

// Ranking de especialidades por solicitudes
app.get('/api/citas/reporte/ranking-especialidades', async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT
         c.cod_especialidad,
         COALESCE(e.nombre_especialidad, '') AS especialidad,
         COUNT(*) AS total_solicitudes
       FROM cita c
       LEFT JOIN especialidad e ON c.cod_especialidad = e.cod_especialidad
       GROUP BY c.cod_especialidad
       ORDER BY total_solicitudes DESC`
    );
    res.json(results);
  } catch (error) {
    console.error('Error en ranking-especialidades:', error);
    res.status(500).json({ message: 'Error al generar ranking de especialidades.' });
  }
});

// Reporte de citas por rango de fechas
app.get('/api/citas/reporte/por-fechas', async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta, filter_by } = req.query;
    if (!fecha_desde || !fecha_hasta) return res.status(400).json({ message: 'Debe proporcionar fecha_desde y fecha_hasta' });

    // Solo permitimos dos opciones para evitar inyección: 'fecha' o 'fecha_creacion'
    const columnExpr = filter_by === 'fecha' ? 'DATE(c.fecha)' : 'DATE(c.fecha_creacion)';

    const sql = `SELECT
         c.cod_cita AS id,
         c.fecha,
         c.hora,
         CONCAT(IFNULL(p.nombre_paciente, ''), ' ', IFNULL(p.apellido_paciente, '')) AS paciente,
         CONCAT(IFNULL(d.nombre_doctor, ''), ' ', IFNULL(d.apellido_doctor, '')) AS doctor,
         c.estado,
         c.fecha_creacion
       FROM cita c
       LEFT JOIN pacientes p ON c.cod_paciente = p.cod_paciente
       LEFT JOIN doctores d ON c.cod_doctor = d.cod_doctor
       WHERE ${columnExpr} BETWEEN ? AND ?
       ORDER BY ${columnExpr} ASC`;

    console.log('reporte/por-fechas params ->', { fecha_desde, fecha_hasta, filter_by });
    console.log('reporte/por-fechas sql ->', sql, 'replacements ->', [fecha_desde, fecha_hasta]);

    const [results] = await db.query(sql, { replacements: [fecha_desde, fecha_hasta] });
    res.json(results);
  } catch (error) {
    console.error('Error en reporte por-fechas:', error);
    res.status(500).json({ message: 'Error al generar el reporte por fechas.' });
  }
});

// --- 4. INICIAR SERVIDOR Y BASE DE DATOS ---
async function start() {
  try {
    // Probar conexión
    await db.authenticate();
    console.log('✅ Conectado a la base de datos (Sequelize)');

    // Sincronizar modelos (alter: false para no borrar datos existentes por error)
    await db.sync({ alter: false });

    // Levantar servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error crítico al iniciar el servidor:', error);
  }
}

start();
