-- Migración 004: Sistema de Stock
-- Incluye: stock de productos y movimientos de stock

-- ============================================
-- TABLA: product_stock
-- Descripción: Stock disponible por producto
-- ============================================
CREATE TABLE IF NOT EXISTS product_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id)
);

-- Índices para product_stock
CREATE INDEX IF NOT EXISTS idx_product_stock_product_id ON product_stock(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_quantity ON product_stock(quantity);
CREATE INDEX IF NOT EXISTS idx_product_stock_low_stock ON product_stock(quantity, min_stock);

-- Trigger para updated_at en product_stock
CREATE TRIGGER update_product_stock_updated_at 
    BEFORE UPDATE ON product_stock 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: stock_movements
-- Descripción: Historial de movimientos de stock (entradas, salidas, ajustes)
-- ============================================
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON UPDATE CASCADE,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('entry', 'exit', 'adjustment')),
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    reference VARCHAR(100),
    user_id UUID REFERENCES users(id) ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para stock_movements
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_user_id ON stock_movements(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);

-- ============================================
-- FUNCIÓN: Registrar movimiento de stock
-- ============================================
CREATE OR REPLACE FUNCTION register_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Registrar el movimiento
    INSERT INTO stock_movements (
        product_id,
        movement_type,
        quantity,
        previous_quantity,
        new_quantity,
        user_id
    ) VALUES (
        NEW.product_id,
        CASE 
            WHEN NEW.quantity > OLD.quantity THEN 'entry'
            WHEN NEW.quantity < OLD.quantity THEN 'exit'
            ELSE 'adjustment'
        END,
        ABS(NEW.quantity - OLD.quantity),
        OLD.quantity,
        NEW.quantity,
        current_setting('app.user_id', true)::UUID
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar movimientos automáticamente
CREATE TRIGGER trigger_stock_movement
    AFTER UPDATE ON product_stock
    FOR EACH ROW
    WHEN (OLD.quantity IS DISTINCT FROM NEW.quantity)
    EXECUTE FUNCTION register_stock_movement();
