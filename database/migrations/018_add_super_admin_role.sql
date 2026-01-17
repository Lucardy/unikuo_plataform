-- Migración 018: Crear rol super_admin
-- Descripción: Agrega el rol de Super Administrador para gestión global de tenants

BEGIN;

INSERT INTO roles (nombre, descripcion)
VALUES ('super_admin', 'Super Administrador de la Plataforma')
ON CONFLICT (nombre) DO NOTHING;

COMMIT;
