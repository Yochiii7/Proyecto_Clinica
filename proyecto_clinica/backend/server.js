// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const pacientesRoutes = require('./routes/pacientes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/pacientes', pacientesRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await db.authenticate();
    console.log('✅ Conectado a la base de datos (Sequelize)');
    // No forzar sync en producción; aquí usamos alter:false para respetar estructura existente
    await db.sync({ alter: false });
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
}

start();
