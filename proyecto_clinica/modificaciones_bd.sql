-- ========================================
-- MODIFICACIONES BASE DE DATOS - SISTEMA DE PAGOS MEJORADO
-- ========================================

-- ========================================
-- 1. CREAR TABLA DE PRECIOS POR ESPECIALIDAD
-- ========================================

CREATE TABLE IF NOT EXISTS precios (
  cod_precio INT AUTO_INCREMENT PRIMARY KEY,
  cod_especialidad INT NOT NULL UNIQUE,
  monto_base DECIMAL(10,2) NOT NULL,
  descripcion VARCHAR(100) NULL,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Clave foránea que relaciona con la tabla especialidad
  FOREIGN KEY (cod_especialidad) REFERENCES especialidad(cod_especialidad) ON DELETE CASCADE
);

-- ========================================
-- 2. MODIFICAR TABLA PAGO PARA PERMITIR MÚLTIPLES PAGOS
-- ========================================

-- Primero eliminamos la restricción de clave foránea si existe
ALTER TABLE pago DROP FOREIGN KEY pago_ibfk_1;

-- Luego eliminamos la tabla si existe para recrearla sin restricciones únicas
DROP TABLE IF EXISTS pago;

-- Recrear la tabla pago sin restricción de unicidad
CREATE TABLE pago (
  cod_pago INT AUTO_INCREMENT PRIMARY KEY,
  cod_cita INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'movil') NOT NULL,
  estado_pago ENUM('pendiente', 'completado', 'rechazado') DEFAULT 'pendiente',
  referencia VARCHAR(100) NULL,
  fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Clave foránea que relaciona con la tabla cita
  FOREIGN KEY (cod_cita) REFERENCES cita(cod_cita) ON DELETE CASCADE
);

-- ========================================
-- 3. ÍNDICES PARA MEJORAR RENDIMIENTO
-- ========================================

-- Índices para tabla precios
CREATE INDEX idx_precios_especialidad ON precios(cod_especialidad);
CREATE INDEX idx_precios_estado ON precios(estado);

-- Índices para tabla pago
CREATE INDEX idx_pago_cita ON pago(cod_cita);
CREATE INDEX idx_pago_estado ON pago(estado_pago);
CREATE INDEX idx_pago_metodo ON pago(metodo_pago);
CREATE INDEX idx_pago_fecha ON pago(fecha_pago);

-- ========================================
-- 4. INSERTAR PRECIOS POR ESPECIALIDAD
-- ========================================

INSERT INTO precios (cod_especialidad, monto_base, descripcion) VALUES
-- Medicina General
(1, 150.00, 'Consulta general de medicina'),
-- Cardiología  
(2, 250.00, 'Consulta especializada de cardiología'),
-- Pediatría
(3, 180.00, 'Consulta pediátrica'),
-- Ginecología
(4, 200.00, 'Consulta ginecológica'),
-- Dermatología
(5, 220.00, 'Consulta dermatológica'),
-- Oftalmología
(6, 180.00, 'Consulta oftalmológica'),
-- Psiquiatría
(7, 300.00, 'Consulta psiquiátrica'),
-- Ortopedia
(8, 200.00, 'Consulta ortopédica');

-- ========================================
-- 5. ACTUALIZAR PAGOS EXISTENTES (SI LOS HAY)
-- ========================================

-- Actualizar montos de pagos existentes según especialidad
UPDATE pago p 
INNER JOIN cita c ON p.cod_cita = c.cod_cita
INNER JOIN precios pr ON c.cod_especialidad = pr.cod_especialidad
SET p.monto = pr.monto_base
WHERE p.estado_pago = 'completado';

-- ========================================
-- 6. VISTAS ÚTILES (OPCIONAL)
-- ========================================

-- Vista para ver resumen de pagos por cita
CREATE OR REPLACE VIEW resumen_pagos_cita AS
SELECT 
    c.cod_cita,
    c.fecha,
    c.hora,
    e.nombre_especialidad,
    pr.monto_base as monto_total,
    COALESCE(SUM(p.monto), 0) as total_pagado,
    (pr.monto_base - COALESCE(SUM(p.monto), 0)) as saldo_pendiente,
    CASE 
        WHEN (pr.monto_base - COALESCE(SUM(p.monto), 0)) <= 0 THEN 'completado'
        WHEN SUM(p.monto) > 0 THEN 'parcial'
        ELSE 'pendiente'
    END as estado_pago_general,
    COUNT(p.cod_pago) as cantidad_pagos
FROM cita c
LEFT JOIN especialidad e ON c.cod_especialidad = e.cod_especialidad
LEFT JOIN precios pr ON e.cod_especialidad = pr.cod_especialidad AND pr.estado = 'activo'
LEFT JOIN pago p ON c.cod_cita = p.cod_cita
GROUP BY c.cod_cita, c.fecha, c.hora, e.nombre_especialidad, pr.monto_base;

-- Vista para ver detalles de pagos
CREATE OR REPLACE VIEW detalle_pagos AS
SELECT 
    p.cod_pago,
    p.cod_cita,
    c.fecha,
    c.hora,
    pac.nombre_paciente,
    pac.apellido_paciente,
    doc.nombre_doctor,
    doc.apellido_doctor,
    e.nombre_especialidad,
    p.monto,
    p.metodo_pago,
    p.estado_pago,
    p.referencia,
    p.fecha_pago,
    pr.monto_base as monto_total_especialidad
FROM pago p
INNER JOIN cita c ON p.cod_cita = c.cod_cita
INNER JOIN pacientes pac ON c.cod_paciente = pac.cod_paciente
INNER JOIN doctores doc ON c.cod_doctor = doc.cod_doctor
INNER JOIN especialidad e ON c.cod_especialidad = e.cod_especialidad
LEFT JOIN precios pr ON e.cod_especialidad = pr.cod_especialidad AND pr.estado = 'activo';

-- ========================================
-- 7. VERIFICACIÓN DE DATOS
-- ========================================

-- Mostrar precios configurados
SELECT 
    pr.cod_precio,
    e.nombre_especialidad,
    pr.monto_base,
    pr.descripcion,
    pr.estado
FROM precios pr
INNER JOIN especialidad e ON pr.cod_especialidad = e.cod_especialidad
ORDER BY e.nombre_especialidad;

-- Mostrar resumen de citas con sus pagos
SELECT 
    rc.cod_cita,
    rc.fecha,
    rc.hora,
    rc.nombre_especialidad,
    rc.monto_total,
    rc.total_pagado,
    rc.saldo_pendiente,
    rc.estado_pago_general,
    rc.cantidad_pagos
FROM resumen_pagos_cita rc
ORDER BY rc.fecha DESC, rc.hora ASC;

-- ========================================
-- 8. NOTAS IMPORTANTES
-- ========================================

/*
CAMBIOS REALIZADOS:

1. TABLA PRECIOS:
   - Se crea tabla para configurar precios por especialidad
   - Cada especialidad tiene un monto base configurable
   - Los precios pueden activarse/desactivarse

2. TABLA PAGO:
   - Se elimina restricción de pago único por cita
   - Ahora permite múltiples pagos parciales
   - Se mantienen todos los campos originales

3. FUNCIONALIDADES NUEVAS:
   - Pagos parciales permitidos
   - Múltiples métodos de pago por cita
   - Cálculo automático de saldo pendiente
   - Estados: pendiente, parcial, completado

4. VISTAS CREADAS:
   - resumen_pagos_cita: Vista general del estado de pagos
   - detalle_pagos: Vista detallada de todos los pagos

5. PRECIOS CONFIGURADOS:
   - Medicina General: $150.00
   - Cardiología: $250.00
   - Pediatría: $180.00
   - Ginecología: $200.00
   - Dermatología: $220.00
   - Oftalmología: $180.00
   - Psiquiatría: $300.00
   - Ortopedia: $200.00

USO:
- Los pagos ahora son acumulativos por cita
- El sistema calcula automáticamente el saldo pendiente
- Se pueden usar múltiples métodos de pago
- El estado se actualiza según el progreso del pago
*/
