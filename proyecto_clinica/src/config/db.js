import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("proyecto_clinica", "root", "", {
  host: "127.0.0.1",   // o el host que aparece en Heidi
  port: 3306,          // usa el mismo puerto que ves en Heidi
  dialect: "mysql"
});

// Probar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos MySQL");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
})();
