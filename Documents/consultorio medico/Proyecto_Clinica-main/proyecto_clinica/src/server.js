import express from "express";
import cors from "cors";
import { sequelize } from "./config/db.js";
import citaRoutes from "./routes/cita.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", citaRoutes);

const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.sync();
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Error al sincronizar con la base de datos:", error);
  }
});
