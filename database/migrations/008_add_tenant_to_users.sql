-- Migración 008: Agregar tenant_id a la tabla users para soporte multi-tenant
-- Fecha: 2026-01-16

-- Agregar columna tenant_id a users
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- Agregar foreign key a tenants
ALTER TABLE users ADD CONSTRAINT users_tenant_id_fkey 
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL;

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);

-- Comentarios
COMMENT ON COLUMN users.tenant_id IS 'ID del tenant al que pertenece el usuario (multi-tenancy)';
