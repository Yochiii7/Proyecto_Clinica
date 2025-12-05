const conexion = require('../models/conexion');

// Obtener todos los usuarios
exports.obtenerUsuarios = (req, res) => {
  conexion.query('SELECT * FROM usuarios', (err, resultados) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(resultados);
    }
  });
};

// Crear un nuevo usuario
exports.crearUsuario = (req, res) => {
  const { nombre, correo } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)';
  conexion.query(sql, [nombre, correo], (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ mensaje: 'Usuario creado correctamente' });
    }
  });
};
