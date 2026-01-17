-- Migración 010: Géneros
-- Incluye: tabla de géneros

-- ============================================
-- TABLA: genders
-- Descripción: Géneros disponibles para productos (Hombre, Mujer, Niño, Niña, Unisex, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS genders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

-- Índices para genders
CREATE INDEX IF NOT EXISTS idx_genders_tenant_id ON genders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_genders_active ON genders(active);
CREATE INDEX IF NOT EXISTS idx_genders_order ON genders(order_index);
CREATE INDEX IF NOT EXISTS idx_genders_tenant_active ON genders(tenant_id, active);

-- Trigger para updated_at en genders
CREATE TRIGGER update_genders_updated_at 
    BEFORE UPDATE ON genders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE genders IS 'Géneros disponibles para productos (Hombre, Mujer, Niño, Niña, Unisex, etc.)';
COMMENT ON COLUMN genders.tenant_id IS 'ID del tenant propietario (NULL para admins)';
COMMENT ON COLUMN genders.name IS 'Nombre del género (ej: Hombre, Mujer, Niño, Niña, Unisex)';
COMMENT ON COLUMN genders.description IS 'Descripción del género';
COMMENT ON COLUMN genders.order_index IS 'Orden de visualización';
COMMENT ON COLUMN genders.active IS 'Estado activo/inactivo del género';
