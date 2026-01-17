-- Migración 019: Limpieza profunda de triggers y columnas legacy en inglés

BEGIN;

-- 1. Eliminar Triggers de update timestamp antiguos (legacy)
DROP TRIGGER IF EXISTS update_users_updated_at ON usuarios CASCADE;
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios CASCADE;
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles CASCADE;
DROP TRIGGER IF EXISTS update_tenants_updated_at ON clientes CASCADE;
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes CASCADE;
DROP TRIGGER IF EXISTS update_products_updated_at ON productos CASCADE;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categorias CASCADE;
DROP TRIGGER IF EXISTS update_brands_updated_at ON marcas CASCADE;
DROP TRIGGER IF EXISTS update_example_table_updated_at ON example_table CASCADE;

-- 2. Eliminar funciones antiguas si ya no se usan (opcional, pero seguro si usamos las versión en español)
-- Intentamos, si falla porque se usa en otro lado, no pasa nada grave, pero limpiamos
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 3. Asegurar que la función en español existe (por si acaso)
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Recrear triggers correctamente en español para tablas críticas
-- Usuarios
DROP TRIGGER IF EXISTS actualizar_timestamp_usuarios ON usuarios;
CREATE TRIGGER actualizar_timestamp_usuarios
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- Roles
DROP TRIGGER IF EXISTS actualizar_timestamp_roles ON roles;
CREATE TRIGGER actualizar_timestamp_roles
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- Clientes
DROP TRIGGER IF EXISTS actualizar_timestamp_clientes ON clientes;
CREATE TRIGGER actualizar_timestamp_clientes
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

COMMIT;
