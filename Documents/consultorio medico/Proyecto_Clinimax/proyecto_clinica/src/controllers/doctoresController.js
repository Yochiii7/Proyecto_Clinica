const Doctor = require('../models/Doctor');

// Listar todos
exports.obtenerDoctores = async (req, res) => {
    try {
        const doctores = await Doctor.findAll({
            order: [['nombre_doctor', 'ASC']]
        });
        res.json(doctores);
    } catch (error) {
        console.error("❌ Error al obtener doctores:", error);
        res.status(500).json({ error: 'Error interno al obtener la lista de doctores' });
    }
};

// Crear nuevo (Aquí estaba tu error principal)
exports.crearDoctor = async (req, res) => {
    try {
        console.log("🟡 Intentando registrar nuevo doctor...");
        console.log("📥 Datos recibidos:", req.body);

        const {
            dni_doctor,
            nombre_doctor,
            apellido_doctor,
            sexo,
            telefono,
            fecha_nacimiento,
            correo,
            nacionalidad,
            estado
        } = req.body;

        // 1. Validaciones obligatorias
        if (!dni_doctor || !nombre_doctor || !apellido_doctor || !sexo || !fecha_nacimiento || !correo) {
            console.log("❌ Validación fallida: Faltan campos");
            return res.status(400).json({ mensaje: 'Por favor complete todos los campos obligatorios (*)' });
        }

        // 2. Verificar duplicados
        const existe = await Doctor.findOne({ where: { dni_doctor } });
        if (existe) {
            console.log("❌ Error: El DNI ya existe");
            return res.status(409).json({ mensaje: 'El doctor con ese DNI ya está registrado.' });
        }

        // 3. Crear en Base de Datos
        // NOTA: Enviamos id_usuario: null explícitamente para evitar problemas
        const nuevo = await Doctor.create({
            dni_doctor,
            nombre_doctor,
            apellido_doctor,
            sexo,
            telefono: telefono || null,
            fecha_nacimiento,
            correo,
            nacionalidad: nacionalidad || 'Venezolano(a)',
            estado: estado || 'Activo',
            id_usuario: null
        });

        console.log("✅ Doctor registrado con ID:", nuevo.cod_doctor);
        res.status(201).json({ mensaje: 'Doctor registrado correctamente', doctor: nuevo });

    } catch (error) {
        console.error("❌ Error CRÍTICO en crearDoctor:", error);
        res.status(500).json({
            mensaje: 'Error interno del servidor al registrar doctor.',
            error: error.message
        });
    }
};

// Actualizar
exports.actualizarDoctor = async (req, res) => {
    try {
        const { dni_doctor } = req.params;
        // Filtramos solo los campos que permitimos editar
        const { nombre_doctor, apellido_doctor, sexo, telefono, fecha_nacimiento, correo, nacionalidad, estado } = req.body;

        const doctor = await Doctor.findOne({ where: { dni_doctor } });
        if (!doctor) return res.status(404).json({ mensaje: 'Doctor no encontrado' });

        await doctor.update({
            nombre_doctor,
            apellido_doctor,
            sexo,
            telefono,
            fecha_nacimiento,
            correo,
            nacionalidad,
            estado
        });

        res.json({ mensaje: 'Datos del doctor actualizados', doctor });

    } catch (error) {
        console.error("❌ Error al actualizar:", error);
        res.status(500).json({ mensaje: 'Error al actualizar el doctor' });
    }
};

// Eliminar
exports.eliminarDoctor = async (req, res) => {
    try {
        const { dni_doctor } = req.params;
        const doctor = await Doctor.findOne({ where: { dni_doctor } });

        if (!doctor) return res.status(404).json({ mensaje: 'Doctor no encontrado' });

        await doctor.destroy();
        res.json({ mensaje: 'Doctor eliminado correctamente' });

    } catch (error) {
        console.error("❌ Error al eliminar:", error);
        res.status(500).json({ mensaje: 'Error al eliminar el doctor' });
    }
};
