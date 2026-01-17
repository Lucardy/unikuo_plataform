-- Migración 008: Banners
-- Incluye: tabla de banners para carrusel de inicio

-- ============================================
-- TABLA: banners
-- Descripción: Banners para carrusel en la página de inicio
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(150),
    description VARCHAR(255),
    image VARCHAR(255) NOT NULL,
    url VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para banners
CREATE INDEX IF NOT EXISTS idx_banners_tenant_id ON banners(tenant_id);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners(order_index);
CREATE INDEX IF NOT EXISTS idx_banners_tenant_active ON banners(tenant_id, active);

-- Trigger para updated_at en banners
CREATE TRIGGER update_banners_updated_at 
    BEFORE UPDATE ON banners 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE banners IS 'Banners para carrusel de inicio';
COMMENT ON COLUMN banners.tenant_id IS 'ID del tenant propietario (NULL para admins)';
COMMENT ON COLUMN banners.title IS 'Título del banner';
COMMENT ON COLUMN banners.description IS 'Descripción del banner';
COMMENT ON COLUMN banners.image IS 'Ruta de la imagen del banner';
COMMENT ON COLUMN banners.url IS 'URL de enlace del banner (opcional)';
COMMENT ON COLUMN banners.order_index IS 'Orden de visualización';
COMMENT ON COLUMN banners.active IS 'Estado activo/inactivo del banner';
