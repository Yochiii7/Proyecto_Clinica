import express from 'express';
import cors from 'cors';
import { conectarDB, sequelize } from './config/db.js';
import citasRoutes from './routes/cita.routes.js';
import pagosRoutes from './routes/pago.routes.js';
import { Paciente, Doctor, Especialidad, Cita } from './models/index.js';

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ruta de prueba básica
app.get('/api/test', (req, res) => {
  res.json({ 
    message: "🚀 Servidor funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba de BD
app.get('/api/test-db', async (req, res) => {
  try {
    const dbConnected = await conectarDB();
    if (dbConnected) {
      res.json({ message: "✅ BD conectada correctamente" });
    } else {
      res.status(500).json({ error: "❌ No se pudo conectar a la BD" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Test de conexión SUPER básico (sin modelos)
app.get('/api/test-db-simple', async (req, res) => {
  try {
    console.log('🔍 Probando conexión básica a MySQL...');
    
    // Conexión directa sin modelos
    await sequelize.authenticate();
    
    res.json({ 
      message: "✅ Conexión básica a MySQL exitosa",
      database: "proyecto_clinica"
    });
  } catch (error) {
    console.error('❌ Error conexión básica:', error.message);
    res.status(500).json({ 
      error: "Error de conexión básica",
      details: error.message 
    });
  }
});

// Rutas de citas
app.use('/api/citas', citasRoutes);

// Rutas de pagos
app.use('/api/pagos', pagosRoutes);

// Endpoints para listar pacientes, doctores y especialidades (necesarios para el frontend)
app.get('/api/pacientes', async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({ order: [['nombre_paciente', 'ASC']] });
    // Mapear a la forma que esperan los componentes antiguos (cedula_paciente, nombre_paciente, ...)
    const data = pacientes.map(p => ({
      cod_paciente: p.cod_paciente,
      cedula_paciente: p.dni_paciente,
      nombre_paciente: p.nombre_paciente,
      apellido_paciente: p.apellido_paciente,
      nombre: `${p.nombre_paciente} ${p.apellido_paciente}`,
      sexo: p.sexo,
      telefono: p.telefono,
      seguro: p.seguro,
      estado: p.estado,
      fecha_creacion: p.fecha_creacion
    }));
    res.json(data);
  } catch (error) {
    console.error('❌ Error al listar pacientes:', error);
    res.status(500).json({ message: 'Error al listar pacientes.' });
  }
});

// Crear paciente (espera campos con nombres 'cedula_paciente', 'nombre_paciente', etc.)
app.post('/api/pacientes', async (req, res) => {
  try {
    const { cedula_paciente, nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado, cargo } = req.body;
    if (!cedula_paciente || !nombre_paciente || !apellido_paciente) {
      return res.status(400).json({ mensaje: 'Campos obligatorios faltantes' });
    }
    const nuevo = await Paciente.create({
      dni_paciente: cedula_paciente,
      nombre_paciente,
      apellido_paciente,
      sexo,
      telefono,
      seguro,
      estado,
      cargo
    });
    res.json({ mensaje: 'Paciente registrado correctamente', paciente: { cod_paciente: nuevo.cod_paciente } });
  } catch (error) {
    console.error('❌ Error creando paciente:', error);
    res.status(500).json({ mensaje: 'Error al crear paciente' });
  }
});

// Actualizar paciente por cédula
app.put('/api/pacientes/:cedula_paciente', async (req, res) => {
  try {
    const { cedula_paciente } = req.params;
    const { nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado } = req.body;
    const [updated] = await Paciente.update({ nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado }, { where: { dni_paciente: cedula_paciente } });
    if (updated === 0) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    res.json({ mensaje: 'Paciente actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error actualizando paciente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar paciente' });
  }
});

// Eliminar paciente por cédula
app.delete('/api/pacientes/:cedula_paciente', async (req, res) => {
  try {
    const { cedula_paciente } = req.params;

    // Buscamos el paciente por su cédula para obtener su PK (cod_paciente)
    const paciente = await Paciente.findOne({ where: { dni_paciente: cedula_paciente } });
    if (!paciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });

    // Usamos una transacción para asegurarnos que ambas operaciones se hagan juntas
    const result = await sequelize.transaction(async (t) => {
      // Eliminar citas asociadas a ese paciente
      const citasEliminadas = await Cita.destroy({ where: { cod_paciente: paciente.cod_paciente }, transaction: t });

      // Eliminar el paciente
      const deleted = await Paciente.destroy({ where: { dni_paciente: cedula_paciente }, transaction: t });

      return { deleted, citasEliminadas };
    });

    res.json({ mensaje: 'Paciente eliminado correctamente', detalles: result });
  } catch (error) {
    console.error('❌ Error eliminando paciente:', error);
    res.status(500).json({ mensaje: 'Error al eliminar paciente' });
  }
});

app.get('/api/doctores', async (req, res) => {
  try {
    // Si se recibe query param ?especialidad=ID devolvemos solo los doctores asociados a esa especialidad
    const { especialidad } = req.query;
    if (especialidad) {
      // Usamos una consulta directa para unir con la tabla doctor_especialidad (presente en el SQL dump)
      const sql = `
        SELECT d.cod_doctor, CONCAT(d.nombre_doctor, ' ', d.apellido_doctor) as nombre
        FROM doctores d
        INNER JOIN doctor_especialidad de ON d.cod_doctor = de.cod_doctor
        WHERE de.cod_especialidad = ?
        ORDER BY d.nombre_doctor ASC
      `;
      const [results] = await sequelize.query(sql, { replacements: [especialidad] });
      return res.json(results);
    }

    const doctores = await Doctor.findAll({ order: [['nombre_doctor', 'ASC']] });
    const data = doctores.map(d => ({ cod_doctor: d.cod_doctor, nombre: `${d.nombre_doctor} ${d.apellido_doctor}` }));
    res.json(data);
  } catch (error) {
    console.error('❌ Error al listar doctores:', error);
    res.status(500).json({ message: 'Error al listar doctores.' });
  }
});

app.get('/api/especialidades', async (req, res) => {
  try {
    const esp = await Especialidad.findAll({ order: [['nombre_especialidad', 'ASC']] });
    const data = esp.map(e => ({ cod_especialidad: e.cod_especialidad, nombre: e.nombre_especialidad }));
    res.json(data);
  } catch (error) {
    console.error('❌ Error al listar especialidades:', error);
    res.status(500).json({ message: 'Error al listar especialidades.' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ✅ MANEJADOR 404 - DEBE IR AL FINAL
app.use((req, res) => {
  res.status(404).json({ 
    error: "Ruta no encontrada",
    path: req.originalUrl,
    availableRoutes: [
      "GET /api/test",
      "GET /api/test-db", 
      "GET /api/test-db-simple",
      "GET /api/citas",
      "POST /api/citas",
      "GET /api/pagos",
      "POST /api/pagos",
      "GET /api/pagos/cita/:cod_cita"
    ]
  });
});

const PORT = process.env.PORT || 3000;

// Iniciar servidor - SIN conectarDB automáticamente
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
  console.log(`📍 Pruebas (el servidor ESTÁ funcionando):`);
  console.log(`   http://localhost:${PORT}/api/test`);
  console.log(`   http://localhost:${PORT}/api/test-db-simple`);
  console.log(`   http://localhost:${PORT}/api/citas`);
  
  // ❌ NO conectar a la BD automáticamente - eso causa el bloqueo
  console.log('⚠️  La conexión a BD se hará cuando llames a /api/test-db-simple');
});

// 🔍 Función separada para probar la conexión manualmente
const probarConexionManual = async () => {
  console.log('🟡 Probando conexión manualmente...');
  try {
    await conectarDB();
  } catch (error) {
    console.log('❌ Conexión manual falló:', error.message);
  }
};

// Ejecutar esta línea solo si quieres probar manualmente:
// probarConexionManual();