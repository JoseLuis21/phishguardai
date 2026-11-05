-- One-time links sent by email to activate accounts created from /registro.
-- Only the SHA-256 of the token is stored: a database leak does not yield
-- usable activation links.

CREATE TABLE IF NOT EXISTS tokens_activacion (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id      BIGINT UNSIGNED NOT NULL,
  token_hash      CHAR(64)        NOT NULL,
  expira          DATETIME        NOT NULL,
  usado           DATETIME        NULL,
  fecha_creacion  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tokens_activacion_hash (token_hash),
  KEY idx_tokens_activacion_usuario (usuario_id, fecha_creacion),
  CONSTRAINT fk_tokens_activacion_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
