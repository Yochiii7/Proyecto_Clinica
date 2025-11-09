const conexion = require('../models/conexion');

// ✅ Obtener todos los pacientes
exports.obtenerPacientes = (req, res) => {
  const sql = 'SELECT * FROM pacientes';
  conexion.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener pacientes:', err);
      return res.status(500).json({ error: err });
    }
    res.json(resultados);
  });
};

// ✅ Crear nuevo paciente
exports.crearPaciente = (req, res) => {
  // 🔍 Si req.body viene vacío, mostramos error
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ mensaje: 'No se recibieron datos en el cuerpo de la solicitud.' });
  }

  // 🧩 Extraemos datos del cuerpo
  const {
    cedula_paciente,
    nombre_paciente,
    apellido_paciente,
    sexo,
    telefono,
    seguro,
    estado,
    cargo
  } = req.body;

  // 🧠 Validamos campos mínimos
  if (!cedula_paciente || !nombre_paciente || !apellido_paciente) {
    return res.status(400).json({ mensaje: 'Campos obligatorios faltantes' });
  }

  // 🧱 Valores por defecto si vienen vacíos
  const sexoFinal = sexo || 'No especificado';
  const telefonoFinal = telefono || 'Sin teléfono';
  const seguroFinal = seguro || 'N/A';
  const estadoFinal = estado || 'Activo';
  const cargoFinal = cargo || 'P';

  // 🧾 SQL: el orden de las columnas coincide con la tabla real
  const sql = `
    INSERT INTO pacientes
    (cedula_paciente, nombre_paciente, apellido_paciente, seguro, telefono, sexo, cargo, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // 🚀 Ejecutamos el query
  conexion.query(
    sql,
    [cedula_paciente, nombre_paciente, apellido_paciente, seguroFinal, telefonoFinal, sexoFinal, cargoFinal, estadoFinal],
    (err, resultado) => {
      if (err) {
        console.error('❌ Error al insertar paciente:', err);
        return res.status(500).json({ error: err });
      }
      res.json({ mensaje: '✅ Paciente registrado correctamente' });
    }
  );
};

// ✅ Actualizar paciente por cédula
exports.actualizarPaciente = (req, res) => {
  const { cedula_paciente } = req.params;
  const { nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado } = req.body;

  const sql = `
    UPDATE pacientes
    SET nombre_paciente=?, apellido_paciente=?, sexo=?, telefono=?, seguro=?, estado=?
    WHERE cedula_paciente=?
  `;

  conexion.query(
    sql,
    [nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado, cedula_paciente],
    (err, resultado) => {
      if (err) {
        console.error('❌ Error al actualizar paciente:', err);
        return res.status(500).json({ error: err });
      }
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Paciente no encontrado' });
      }
      res.json({ mensaje: '✅ Paciente actualizado correctamente' });
    }
  );
};

// ✅ Eliminar paciente
exports.eliminarPaciente = (req, res) => {
  const { cedula_paciente } = req.params;

  conexion.query('DELETE FROM pacientes WHERE cedula_paciente=?', [cedula_paciente], (err, resultado) => {
    if (err) {
      console.error('❌ Error al eliminar paciente:', err);
      return res.status(500).json({ error: err });
    }
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
    res.json({ mensaje: '✅ Paciente eliminado correctamente' });
  });
};
