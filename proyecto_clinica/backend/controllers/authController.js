const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta para firmar tokens (En producción usa variables de entorno .env)
const JWT_SECRET = 'secreto_super_seguro_tsu_2025';

// REGISTRAR USUARIO
exports.registrar = async (req, res) => {
  try {
    const { nombre, usuario, email, clave, cargo } = req.body;

    // 1. Validar campos
    if (!nombre || !usuario || !clave || !cargo) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    // 2. Verificar si usuario o email ya existen
    const existe = await Usuario.findOne({ where: { usuario } });
    if (existe) return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashClave = await bcrypt.hash(clave, salt);

    // 4. Guardar en BD
    const nuevoUsuario = await Usuario.create({
      nombre,
      usuario,
      email,
      clave: hashClave, // Guardamos el hash, no el texto plano
      cargo
    });

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: nuevoUsuario.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al registrar' });
  }
};

// INICIAR SESIÓN
exports.login = async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    // 1. Buscar usuario
    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // 2. Comparar contraseñas (Texto plano vs Hash en BD)
    const validPass = await bcrypt.compare(clave, user.clave);
    if (!validPass) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // 3. Generar Token
    const token = jwt.sign(
      { id: user.id, cargo: user.cargo, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: '8h' } // La sesión dura 8 horas
    );

    res.json({
      mensaje: 'Bienvenido',
      token,
      usuario: { nombre: user.nombre, cargo: user.cargo }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
