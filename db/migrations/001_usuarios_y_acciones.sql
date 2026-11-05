-- PhishGuardAI web app: users and analyst actions.
-- The tables owned by the Python analyzer (correos_analizados,
-- indicadores_phishing, eventos_sistema) are not modified.

CREATE TABLE IF NOT EXISTS usuarios (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email           VARCHAR(254)    NOT NULL,
  nombre          VARCHAR(120)    NULL,
  password_hash   VARCHAR(255)    NOT NULL,
  rol             VARCHAR(20)     NOT NULL DEFAULT 'EMPLEADO',
  activo          TINYINT(1)      NOT NULL DEFAULT 1,
  fecha_creacion  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso   DATETIME        NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  CONSTRAINT chk_usuarios_rol CHECK (rol IN ('ANALISTA', 'EMPLEADO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS acciones_analista (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  correo_id   BIGINT UNSIGNED NOT NULL,
  usuario_id  BIGINT UNSIGNED NOT NULL,
  tipo        VARCHAR(40)     NOT NULL,
  detalle     VARCHAR(1000)   NULL,
  fecha       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_acciones_correo_fecha (correo_id, fecha),
  KEY idx_acciones_usuario (usuario_id),
  CONSTRAINT fk_acciones_correo  FOREIGN KEY (correo_id)  REFERENCES correos_analizados (id),
  CONSTRAINT fk_acciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
  CONSTRAINT chk_acciones_tipo CHECK (tipo IN (
    'DOMINIO_BLOQUEADO',
    'BUSQUEDA_TENANT',
    'INFORME_REENVIADO',
    'ANULADO'
  ))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
