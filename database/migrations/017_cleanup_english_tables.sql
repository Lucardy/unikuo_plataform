-- Migración 017: Eliminar tablas en inglés (Limpieza)
-- Elimina tablas duplicadas que pudieron quedar por ejecuciones previas de migraciones

BEGIN;

-- Deshabilitar triggers temporalmente por dependencias cruzadas (opcional, pero seguro)
SET session_replication_role = 'replica';

-- Eliminar tablas en inglés SOLAMENTE SI existen
-- (El orden importa para evitar errores de Foreign Keys si no se usa CASCADE)

DROP TABLE IF EXISTS sale_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS cash_register_shifts CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS product_stock CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_videos CASCADE;
DROP TABLE IF EXISTS price_quantity CASCADE;
DROP TABLE IF EXISTS product_brands CASCADE;
DROP TABLE IF EXISTS product_colors CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS size_types CASCADE;
DROP TABLE IF EXISTS genders CASCADE;
DROP TABLE IF EXISTS measure_types CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Reactivar triggers
SET session_replication_role = 'origin';

COMMIT;
