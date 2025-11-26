// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// --- IMPORTAR RUTAS ---
const pacientesRoutes = require('./routes/pacientes');
const facturasRoutes = require('./routes/facturas');


const servicioRoutes = require('./routes/servicios'); 
const doctorRoutes = require('./routes/doctores'); // Asumo que el archivo se llama 'doctores.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/facturas', facturasRoutes);

// --- USAR RUTAS ---
app.use('/api/pacientes', pacientesRoutes);

app.use('/api/servicios', servicioRoutes);
app.use('/api/doctores', doctorRoutes); 


const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await db.authenticate();
    console.log('✅ Conectado a la base de datos (Sequelize)');
    await db.sync({ alter: false });
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
}

start();
