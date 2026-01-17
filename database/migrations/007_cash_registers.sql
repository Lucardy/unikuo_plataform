-- Migración 007: Sistema de Cajas y Turnos
-- Incluye: turnos de caja y relación con ventas

-- ============================================
-- TABLA: cash_register_shifts
-- Descripción: Turnos de caja (apertura y cierre)
-- ============================================
CREATE TABLE IF NOT EXISTS cash_register_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    opening_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closing_date TIMESTAMP,
    initial_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    expected_cash_amount DECIMAL(10, 2),
    actual_cash_amount DECIMAL(10, 2),
    difference DECIMAL(10, 2),
    total_sales DECIMAL(10, 2),
    total_cash DECIMAL(10, 2),
    total_transfer DECIMAL(10, 2),
    total_card DECIMAL(10, 2),
    sales_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para cash_register_shifts
CREATE INDEX IF NOT EXISTS idx_cash_shifts_user_id ON cash_register_shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_shifts_tenant_id ON cash_register_shifts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cash_shifts_status ON cash_register_shifts(status);
CREATE INDEX IF NOT EXISTS idx_cash_shifts_opening_date ON cash_register_shifts(opening_date);

-- Trigger para updated_at en cash_register_shifts
CREATE TRIGGER update_cash_shifts_updated_at 
    BEFORE UPDATE ON cash_register_shifts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Agregar campo shift_id a la tabla sales
-- ============================================
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS shift_id UUID REFERENCES cash_register_shifts(id) ON DELETE SET NULL;

-- Índice para shift_id en sales
CREATE INDEX IF NOT EXISTS idx_sales_shift_id ON sales(shift_id);

-- ============================================
-- Función para calcular totales de un turno
-- ============================================
CREATE OR REPLACE FUNCTION calculate_shift_totals(shift_uuid UUID)
RETURNS TABLE (
    total_sales DECIMAL(10, 2),
    total_cash DECIMAL(10, 2),
    total_transfer DECIMAL(10, 2),
    total_card DECIMAL(10, 2),
    sales_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(s.total), 0)::DECIMAL(10, 2) as total_sales,
        COALESCE(SUM(CASE WHEN s.payment_method = 'cash' THEN s.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_cash,
        COALESCE(SUM(CASE WHEN s.payment_method = 'transfer' THEN s.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_transfer,
        COALESCE(SUM(CASE WHEN s.payment_method IN ('debit_card', 'credit_card') THEN s.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_card,
        COUNT(s.id) as sales_count
    FROM sales s
    WHERE s.shift_id = shift_uuid AND s.status = 'completed';
END;
$$ LANGUAGE plpgsql;
