const express = require('express');
const cors = require('cors');
const app = express();
const pacientesRoutes = require('./routes/pacientes');

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json()); // ✅ Esto DEBE ir antes de las rutas
app.use(express.urlencoded({ extended: true })); // opcional, para formularios

// 🔥 RUTAS
app.use('/api/pacientes', pacientesRoutes);

// 🔥 SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
