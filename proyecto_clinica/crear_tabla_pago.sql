-- ========================================
-- CREAR TABLA PAGO
-- ========================================

CREATE TABLE IF NOT EXISTS pago (
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
-- ÍNDICES OPCIONALES PARA MEJORAR RENDIMIENTO
-- ========================================

-- Índice para búsquedas por cita
CREATE INDEX idx_pago_cita ON pago(cod_cita);

-- Índice para búsquedas por estado
CREATE INDEX idx_pago_estado ON pago(estado_pago);

-- Índice para búsquedas por método de pago
CREATE INDEX idx_pago_metodo ON pago(metodo_pago);

-- ========================================
-- COMENTARIOS ADICIONALES
-- ========================================

/*
ESTRUCTURA DE LA TABLA PAGO:

cod_pago: INT AUTO_INCREMENT PRIMARY KEY
  - Identificador único del pago
  - Se incrementa automáticamente

cod_cita: INT NOT NULL
  - Referencia a la cita asociada
  - Relacionado con cita.cod_cita
  - ON DELETE CASCADE: si se elimina la cita, se elimina el pago

monto: DECIMAL(10,2) NOT NULL
  - Monto del pago
  - Máximo: 99,999,999.99
  - Requerido

metodo_pago: ENUM('efectivo', 'tarjeta', 'transferencia', 'movil') NOT NULL
  - Método de pago utilizado
  - Valores posibles: 'efectivo', 'tarjeta', 'transferencia', 'movil'
  - Requerido

estado_pago: ENUM('pendiente', 'completado', 'rechazado') DEFAULT 'pendiente'
  - Estado del pago
  - Valores posibles: 'pendiente', 'completado', 'rechazado'
  - Por defecto: 'pendiente'

referencia: VARCHAR(100) NULL
  - Número de referencia del pago
  - Opcional
  - Puede ser: número de operación, últimos 4 dígitos, etc.

fecha_pago: DATETIME DEFAULT CURRENT_TIMESTAMP
  - Fecha y hora del pago
  - Por defecto: fecha y hora actual

fecha_creacion: DATETIME DEFAULT CURRENT_TIMESTAMP
  - Fecha y hora de creación del registro
  - Por defecto: fecha y hora actual

RESTRICCIONES:
- Cada cita solo puede tener un pago (clave foránea única a nivel lógico)
- Si se elimina una cita, se eliminan sus pagos asociados
- El monto no puede ser nulo
- El método de pago es obligatorio
*/
