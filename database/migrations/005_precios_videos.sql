-- Migración 005: Precios por Cantidad y Videos de Productos

-- ============================================
-- TABLA: price_quantity
-- Descripción: Precios por cantidad (descuentos por volumen)
-- ============================================
CREATE TABLE IF NOT EXISTS price_quantity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para price_quantity
CREATE INDEX IF NOT EXISTS idx_price_quantity_product_id ON price_quantity(product_id);
CREATE INDEX IF NOT EXISTS idx_price_quantity_range ON price_quantity(min_quantity, max_quantity);
CREATE INDEX IF NOT EXISTS idx_price_quantity_active ON price_quantity(active);

-- Trigger para updated_at en price_quantity
CREATE TRIGGER update_price_quantity_updated_at 
    BEFORE UPDATE ON price_quantity 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: product_videos
-- Descripción: Videos asociados a productos
-- ============================================
CREATE TABLE IF NOT EXISTS product_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    video_type VARCHAR(20) DEFAULT 'youtube' CHECK (video_type IN ('youtube', 'vimeo', 'local', 'other')),
    title VARCHAR(200),
    description TEXT,
    is_primary BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para product_videos
CREATE INDEX IF NOT EXISTS idx_product_videos_product_id ON product_videos(product_id);
CREATE INDEX IF NOT EXISTS idx_product_videos_order ON product_videos(order_index);
CREATE INDEX IF NOT EXISTS idx_product_videos_primary ON product_videos(is_primary);
CREATE INDEX IF NOT EXISTS idx_product_videos_active ON product_videos(active);

-- Trigger para updated_at en product_videos
CREATE TRIGGER update_product_videos_updated_at 
    BEFORE UPDATE ON product_videos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
