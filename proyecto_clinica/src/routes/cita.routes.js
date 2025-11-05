import express from "express";
import { crearCita, listarCitas, actualizarCita, eliminarCita } from "../controllers/cita.controller.js";

const router = express.Router();

// Rutas del CRUD
router.post("/citas", crearCita);         // Crear cita
router.get("/citas", listarCitas);        // Listar todas las citas
router.put("/citas/:id", actualizarCita); // Actualizar cita
router.delete("/citas/:id", eliminarCita); // Eliminar cita

export default router;
