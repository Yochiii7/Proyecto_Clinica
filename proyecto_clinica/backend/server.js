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
