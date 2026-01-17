-- Migración 003: Atributos de Productos
-- Incluye: marcas, talles (tipos y talles), colores

-- ============================================
-- TABLA: brands
-- Descripción: Marcas de productos
-- ============================================
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    logo_path VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para marcas
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(active);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);

-- Trigger para updated_at en marcas
CREATE TRIGGER update_brands_updated_at 
    BEFORE UPDATE ON brands 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: product_brands
-- Descripción: Relación muchos a muchos entre productos y marcas
-- ============================================
CREATE TABLE IF NOT EXISTS product_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, brand_id)
);

-- Índices para product_brands
CREATE INDEX IF NOT EXISTS idx_product_brands_product_id ON product_brands(product_id);
CREATE INDEX IF NOT EXISTS idx_product_brands_brand_id ON product_brands(brand_id);

-- ============================================
-- TABLA: size_types
-- Descripción: Tipos de talles (Alfabético, Numérico, Dobles talles, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS size_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para size_types
CREATE INDEX IF NOT EXISTS idx_size_types_active ON size_types(active);

-- Trigger para updated_at en size_types
CREATE TRIGGER update_size_types_updated_at 
    BEFORE UPDATE ON size_types 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: sizes
-- Descripción: Talles específicos asociados a un tipo
-- ============================================
CREATE TABLE IF NOT EXISTS sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    size_type_id UUID NOT NULL REFERENCES size_types(id) ON UPDATE CASCADE,
    name VARCHAR(50) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(size_type_id, name)
);

-- Índices para sizes
CREATE INDEX IF NOT EXISTS idx_sizes_size_type_id ON sizes(size_type_id);
CREATE INDEX IF NOT EXISTS idx_sizes_order ON sizes(order_index);

-- Trigger para updated_at en sizes
CREATE TRIGGER update_sizes_updated_at 
    BEFORE UPDATE ON sizes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: product_sizes
-- Descripción: Relación muchos a muchos entre productos y talles
-- ============================================
CREATE TABLE IF NOT EXISTS product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_id UUID NOT NULL REFERENCES sizes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, size_id)
);

-- Índices para product_sizes
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_sizes_size_id ON product_sizes(size_id);

-- ============================================
-- TABLA: colors
-- Descripción: Colores disponibles para productos
-- ============================================
CREATE TABLE IF NOT EXISTS colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(80) NOT NULL UNIQUE,
    hex_code VARCHAR(7),
    show_color BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para colores
CREATE INDEX IF NOT EXISTS idx_colors_active ON colors(active);
CREATE INDEX IF NOT EXISTS idx_colors_order ON colors(order_index);

-- Trigger para updated_at en colores
CREATE TRIGGER update_colors_updated_at 
    BEFORE UPDATE ON colors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: product_colors
-- Descripción: Relación muchos a muchos entre productos y colores
-- ============================================
CREATE TABLE IF NOT EXISTS product_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    color_id UUID NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, color_id)
);

-- Índices para product_colors
CREATE INDEX IF NOT EXISTS idx_product_colors_product_id ON product_colors(product_id);
CREATE INDEX IF NOT EXISTS idx_product_colors_color_id ON product_colors(color_id);
