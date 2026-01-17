-- Migración 006: Sistema de Ventas
-- Incluye: ventas e items de venta

-- ============================================
-- TABLA: sales
-- Descripción: Ventas realizadas
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10, 2) DEFAULT 0.00,
    discount_total DECIMAL(10, 2) DEFAULT 0.00,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    client_document VARCHAR(50),
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'transfer', 'debit_card', 'credit_card', 'other')),
    discount_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para sales
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoice_number ON sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);

-- Trigger para updated_at en sales
CREATE TRIGGER update_sales_updated_at 
    BEFORE UPDATE ON sales 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: sale_items
-- Descripción: Items de cada venta
-- ============================================
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON UPDATE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para sale_items
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

-- Función para generar número de factura
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    today DATE := CURRENT_DATE;
    date_str TEXT := TO_CHAR(today, 'YYYYMMDD');
    last_number INTEGER;
    new_number TEXT;
BEGIN
    -- Obtener el último número del día
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS INTEGER)), 0)
    INTO last_number
    FROM sales
    WHERE invoice_number LIKE 'FACT-' || date_str || '-%';
    
    -- Incrementar
    new_number := 'FACT-' || date_str || '-' || LPAD((last_number + 1)::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;
