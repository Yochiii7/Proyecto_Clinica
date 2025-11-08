import express from 'express';
import cors from 'cors';
import { conectarDB, sequelize } from './config/db.js';
import citasRoutes from './routes/cita.routes.js';

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
      "POST /api/citas"
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