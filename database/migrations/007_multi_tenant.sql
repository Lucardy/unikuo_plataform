-- Migración 007: Sistema Multi-Tenant
-- Agrega soporte para múltiples clientes en una misma base de datos

-- ============================================
-- TABLA: tenants
-- Descripción: Clientes/Tenants del sistema
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(20),
    domain VARCHAR(255),
    active BOOLEAN DEFAULT true,
    owner_id UUID REFERENCES users(id) ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para tenants
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_active ON tenants(active);
CREATE INDEX IF NOT EXISTS idx_tenants_owner_id ON tenants(owner_id);

-- Trigger para updated_at en tenants
CREATE TRIGGER update_tenants_updated_at 
    BEFORE UPDATE ON tenants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AGREGAR tenant_id A TODAS LAS TABLAS RELEVANTES
-- ============================================

-- Categorías
ALTER TABLE categories ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_categories_tenant_id ON categories(tenant_id);

-- Productos
ALTER TABLE products ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);

-- Imágenes de productos (heredan del producto, pero por seguridad también)
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_product_images_tenant_id ON product_images(tenant_id);

-- Marcas
ALTER TABLE brands ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_brands_tenant_id ON brands(tenant_id);

-- Tipos de talle
ALTER TABLE size_types ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_size_types_tenant_id ON size_types(tenant_id);

-- Talles
ALTER TABLE sizes ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_sizes_tenant_id ON sizes(tenant_id);

-- Colores
ALTER TABLE colors ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_colors_tenant_id ON colors(tenant_id);

-- Stock
ALTER TABLE product_stock ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_product_stock_tenant_id ON product_stock(tenant_id);

-- Movimientos de stock
ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_stock_movements_tenant_id ON stock_movements(tenant_id);

-- Precios por cantidad
ALTER TABLE price_quantity ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_price_quantity_tenant_id ON price_quantity(tenant_id);

-- Videos de productos
ALTER TABLE product_videos ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_product_videos_tenant_id ON product_videos(tenant_id);

-- Ventas
ALTER TABLE sales ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_sales_tenant_id ON sales(tenant_id);

-- Items de venta (heredan del tenant de la venta)
ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_sale_items_tenant_id ON sale_items(tenant_id);

-- ============================================
-- FUNCIÓN: Obtener tenant_id de un usuario
-- ============================================
CREATE OR REPLACE FUNCTION get_user_tenant_id(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    v_tenant_id UUID;
BEGIN
    -- Buscar si el usuario es owner de un tenant
    SELECT id INTO v_tenant_id
    FROM tenants
    WHERE owner_id = p_user_id AND active = true
    LIMIT 1;
    
    -- Si no es owner, buscar por roles (store_owner)
    IF v_tenant_id IS NULL THEN
        SELECT t.id INTO v_tenant_id
        FROM tenants t
        INNER JOIN users u ON t.owner_id = u.id
        INNER JOIN user_roles ur ON u.id = ur.user_id
        INNER JOIN roles r ON ur.role_id = r.id
        WHERE r.name = 'store_owner' AND u.id = p_user_id AND t.active = true
        LIMIT 1;
    END IF;
    
    RETURN v_tenant_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS: Auto-asignar tenant_id
-- ============================================

-- Trigger para product_images: heredar tenant_id del producto
CREATE OR REPLACE FUNCTION set_product_image_tenant()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tenant_id IS NULL THEN
        SELECT tenant_id INTO NEW.tenant_id
        FROM products
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_product_image_tenant
    BEFORE INSERT OR UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION set_product_image_tenant();

-- Trigger para sale_items: heredar tenant_id de la venta
CREATE OR REPLACE FUNCTION set_sale_item_tenant()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tenant_id IS NULL THEN
        SELECT tenant_id INTO NEW.tenant_id
        FROM sales
        WHERE id = NEW.sale_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_sale_item_tenant
    BEFORE INSERT OR UPDATE ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION set_sale_item_tenant();

-- Trigger para stock_movements: heredar tenant_id del producto
CREATE OR REPLACE FUNCTION set_stock_movement_tenant()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tenant_id IS NULL THEN
        SELECT tenant_id INTO NEW.tenant_id
        FROM products
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_stock_movement_tenant
    BEFORE INSERT OR UPDATE ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION set_stock_movement_tenant();
