-- ========================================
-- DATOS DE PRUEBA PARA SISTEMA DE CLÍNICA
-- ========================================

-- Limpiar tablas existentes (opcional)
-- DELETE FROM pago;
-- DELETE FROM cita;
-- DELETE FROM doctor_especialidad;
-- DELETE FROM doctores;
-- DELETE FROM especialidad;
-- DELETE FROM pacientes;

-- ========================================
-- ESPECIALIDADES
-- ========================================
INSERT INTO especialidad (cod_especialidad, nombre_especialidad, fecha_creacion) VALUES
(1, 'Medicina General', '2024-01-01 00:00:00'),
(2, 'Cardiología', '2024-01-01 00:00:00'),
(3, 'Pediatría', '2024-01-01 00:00:00'),
(4, 'Ginecología', '2024-01-01 00:00:00'),
(5, 'Dermatología', '2024-01-01 00:00:00'),
(6, 'Oftalmología', '2024-01-01 00:00:00'),
(7, 'Psiquiatría', '2024-01-01 00:00:00'),
(8, 'Ortopedia', '2024-01-01 00:00:00');

-- ========================================
-- PACIENTES
-- ========================================
INSERT INTO pacientes (cod_paciente, dni_paciente, nombre_paciente, apellido_paciente, seguro, telefono, sexo, cargo, estado, fecha_creacion) VALUES
(1, '12345678', 'Juan', 'Pérez', 'S1', '04121234567', 'Masculino', 'A', 'Activo', '2024-01-01 00:00:00'),
(2, '87654321', 'María', 'González', 'S2', '04162345678', 'Femenino', 'A', 'Activo', '2024-01-02 00:00:00'),
(3, '11223344', 'Carlos', 'Rodríguez', 'S1', '04143456789', 'Masculino', 'A', 'Activo', '2024-01-03 00:00:00'),
(4, '55667788', 'Ana', 'Martínez', 'S3', '04124567890', 'Femenino', 'A', 'Activo', '2024-01-04 00:00:00'),
(5, '99887766', 'Luis', 'Sánchez', 'S2', '04125678901', 'Masculino', 'A', 'Activo', '2024-01-05 00:00:00'),
(6, '44556677', 'Carmen', 'López', 'S1', '04126789012', 'Femenino', 'A', 'Activo', '2024-01-06 00:00:00'),
(7, '33445566', 'Roberto', 'Díaz', 'S3', '04127890123', 'Masculino', 'A', 'Activo', '2024-01-07 00:00:00'),
(8, '77889900', 'Patricia', 'Fernández', 'S1', '04128901234', 'Femenino', 'A', 'Activo', '2024-01-08 00:00:00');

-- ========================================
-- DOCTORES
-- ========================================
INSERT INTO doctores (cod_doctor, dni_doctor, nombre_doctor, apellido_doctor, sexo, telefono, fecha_nacimiento, correo, nacionalidad, estado, fecha_creacion) VALUES
(1, '11112222', 'Roberto', 'García', 'Masculino', '04141112233', '1980-05-15', 'rgarcia@clinica.com', 'Venezolano', 'Activo', '2024-01-01 00:00:00'),
(2, '33334444', 'María', 'Hernández', 'Femenino', '04163334455', '1985-08-22', 'mhernandez@clinica.com', 'Venezolana', 'Activo', '2024-01-02 00:00:00'),
(3, '55556666', 'José', 'Martínez', 'Masculino', '04145556677', '1978-03-10', 'jmartinez@clinica.com', 'Venezolano', 'Activo', '2024-01-03 00:00:00'),
(4, '77778888', 'Ana', 'Sánchez', 'Femenino', '04127778899', '1982-11-30', 'asanchez@clinica.com', 'Venezolana', 'Activo', '2024-01-04 00:00:00'),
(5, '99990000', 'Luis', 'Pérez', 'Masculino', '04169990011', '1975-07-18', 'lperez@clinica.com', 'Venezolano', 'Activo', '2024-01-05 00:00:00'),
(6, '22223333', 'Carmen', 'Díaz', 'Femenino', '04142223344', '1988-09-25', 'cdiaz@clinica.com', 'Venezolana', 'Activo', '2024-01-06 00:00:00');

-- ========================================
-- DOCTOR_ESPECIALIDAD (RELACIONES)
-- ========================================
INSERT INTO doctor_especialidad (cod_doctor, cod_especialidad) VALUES
-- Dr. Roberto García - Medicina General y Cardiología
(1, 1),
(1, 2),
-- Dra. María Hernández - Pediatría
(2, 3),
-- Dr. José Martínez - Ginecología
(3, 4),
-- Dra. Ana Sánchez - Dermatología y Oftalmología
(4, 5),
(4, 6),
-- Dr. Luis Pérez - Psiquiatría
(5, 7),
-- Dra. Carmen Díaz - Ortopedia
(6, 8);

-- ========================================
-- CITAS
-- ========================================
INSERT INTO cita (cod_cita, fecha, hora, cod_paciente, cod_doctor, cod_especialidad, estado, fecha_creacion) VALUES
-- Citas con Dr. Roberto García (Medicina General)
(1, '2024-12-01', '09:00:00', 1, 1, 1, 'A', '2024-11-25 10:00:00'),
(2, '2024-12-01', '10:00:00', 2, 1, 1, 'A', '2024-11-25 11:00:00'),
(3, '2024-12-02', '11:00:00', 3, 1, 1, 'P', '2024-11-26 09:00:00'),

-- Citas con Dra. María Hernández (Pediatría)
(4, '2024-12-01', '14:00:00', 4, 2, 3, 'A', '2024-11-25 14:00:00'),
(5, '2024-12-03', '15:00:00', 5, 2, 3, 'P', '2024-11-27 16:00:00'),

-- Citas con Dr. José Martínez (Ginecología)
(6, '2024-12-02', '16:00:00', 6, 3, 4, 'P', '2024-11-26 17:00:00'),
(7, '2024-12-04', '09:00:00', 7, 3, 4, 'P', '2024-11-28 08:00:00'),

-- Citas con Dra. Ana Sánchez (Dermatología)
(8, '2024-12-03', '10:00:00', 8, 4, 5, 'P', '2024-11-27 10:00:00'),

-- Citas con Dr. Luis Pérez (Psiquiatría)
(9, '2024-12-04', '11:00:00', 1, 5, 7, 'P', '2024-11-28 12:00:00'),

-- Citas con Dra. Carmen Díaz (Ortopedia)
(10, '2024-12-05', '14:00:00', 2, 6, 8, 'P', '2024-11-29 13:00:00');

-- ========================================
-- PAGOS
-- ========================================
INSERT INTO pago (cod_pago, cod_cita, monto, metodo_pago, estado_pago, referencia, fecha_pago, fecha_creacion) VALUES
-- Pagos completados
(1, 1, 150.00, 'efectivo', 'completado', 'EF-001', '2024-12-01 09:30:00', '2024-12-01 09:30:00'),
(2, 2, 150.00, 'tarjeta', 'completado', '****1234', '2024-12-01 10:30:00', '2024-12-01 10:30:00'),
(3, 4, 180.00, 'transferencia', 'completado', 'TRN-2024-001', '2024-12-01 14:30:00', '2024-12-01 14:30:00'),

-- Pagos pendientes
(4, 3, 150.00, 'movil', 'pendiente', 'PM-04141234567', '2024-12-02 11:30:00', '2024-12-02 11:30:00'),
(5, 5, 180.00, 'tarjeta', 'pendiente', NULL, '2024-12-03 15:30:00', '2024-12-03 15:30:00'),

-- Pagos rechazados
(6, 6, 200.00, 'tarjeta', 'rechazado', '****5678', '2024-12-02 16:30:00', '2024-12-02 16:30:00');

-- ========================================
-- RESUMEN DE DATOS CREADOS
-- ========================================
/*
ESPECIALIDADES: 8
- Medicina General, Cardiología, Pediatría, Ginecología, Dermatología, Oftalmología, Psiquiatría, Ortopedia

PACIENTES: 8
- Juan Pérez, María González, Carlos Rodríguez, Ana Martínez, Luis Sánchez, Carmen López, Roberto Díaz, Patricia Fernández

DOCTORES: 6
- Dr. Roberto García (Medicina General, Cardiología)
- Dra. María Hernández (Pediatría)
- Dr. José Martínez (Ginecología)
- Dra. Ana Sánchez (Dermatología, Oftalmología)
- Dr. Luis Pérez (Psiquiatría)
- Dra. Carmen Díaz (Ortopedia)

CITAS: 10
- 3 atendidas (estado 'A')
- 7 por atender (estado 'P')

PAGOS: 6
- 3 completados
- 2 pendientes
- 1 rechazado
- 4 citas sin pago

ESTADOS DE PAGO POSIBLES:
- 'completado': Pagado exitosamente
- 'pendiente': Pago en proceso
- 'rechazado': Pago rechazado
- NULL: No hay pago registrado

MÉTODOS DE PAGO:
- 'efectivo': Pago en efectivo
- 'tarjeta': Tarjeta de crédito/débito
- 'transferencia': Transferencia bancaria
- 'movil': Pago móvil

ESTADOS DE CITA:
- 'P': Por atender
- 'A': Atendido
- 'C': Cancelado
*/
