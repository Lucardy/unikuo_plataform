-- Migración 009: Medidas
-- Incluye: tabla de tipos de medida

-- ============================================
-- TABLA: measure_types
-- Descripción: Tipos de medida (Longitud, Peso, Volumen, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS measure_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    unit VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

-- Índices para measure_types
CREATE INDEX IF NOT EXISTS idx_measure_types_tenant_id ON measure_types(tenant_id);
CREATE INDEX IF NOT EXISTS idx_measure_types_active ON measure_types(active);
CREATE INDEX IF NOT EXISTS idx_measure_types_tenant_active ON measure_types(tenant_id, active);

-- Trigger para updated_at en measure_types
CREATE TRIGGER update_measure_types_updated_at 
    BEFORE UPDATE ON measure_types 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE measure_types IS 'Tipos de medida para productos (Longitud, Peso, Volumen, etc.)';
COMMENT ON COLUMN measure_types.tenant_id IS 'ID del tenant propietario (NULL para admins)';
COMMENT ON COLUMN measure_types.name IS 'Nombre del tipo de medida (ej: Longitud, Peso, Volumen)';
COMMENT ON COLUMN measure_types.description IS 'Descripción del tipo de medida';
COMMENT ON COLUMN measure_types.unit IS 'Unidad de medida (ej: cm, kg, litros)';
COMMENT ON COLUMN measure_types.active IS 'Estado activo/inactivo del tipo de medida';
