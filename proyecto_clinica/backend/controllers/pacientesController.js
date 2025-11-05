const conexion = require('../models/conexion');

// Obtener todos los pacientes
exports.obtenerPacientes = (req, res) => {
  const sql = 'SELECT * FROM pacientes';
  conexion.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: err });
    res.json(resultados);
  });
};

// Crear nuevo paciente
exports.crearPaciente = (req, res) => {
  const { cedula_paciente, nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado, cargo } = req.body;

  if (!cedula_paciente || !nombre_paciente || !apellido_paciente)
    return res.status(400).json({ mensaje: 'Campos obligatorios faltantes' });

  const sql = `INSERT INTO pacientes
    (cedula_paciente, nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado, cargo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  conexion.query(sql, [cedula_paciente, nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado, cargo], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Paciente registrado correctamente' });
  });
};

// Actualizar paciente por cédula
exports.actualizarPaciente = (req, res) => {
  const { cedula_paciente } = req.params;
  const { nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado } = req.body;

  const sql = `UPDATE pacientes SET nombre_paciente=?, apellido_paciente=?, sexo=?, telefono=?, seguro=?, estado=?
               WHERE cedula_paciente=?`;

  conexion.query(sql, [nombre_paciente, apellido_paciente, sexo, telefono, seguro, estado, cedula_paciente], (err, resultado) => {
    if (err) return res.status(500).json({ error: err });
    if (resultado.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    res.json({ mensaje: 'Paciente actualizado correctamente' });
  });
};

// Eliminar paciente
exports.eliminarPaciente = (req, res) => {
  const { cedula_paciente } = req.params;
  conexion.query('DELETE FROM pacientes WHERE cedula_paciente=?', [cedula_paciente], (err, resultado) => {
    if (err) return res.status(500).json({ error: err });
    if (resultado.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    res.json({ mensaje: 'Paciente eliminado correctamente' });
  });
};
