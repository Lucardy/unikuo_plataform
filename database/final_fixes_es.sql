-- Final Fixes and Remaining Renames to Spanish

-- Turnos Caja (Remaining columns)
ALTER TABLE turnos_caja RENAME COLUMN opening_date TO fecha_apertura;
ALTER TABLE turnos_caja RENAME COLUMN closing_date TO fecha_cierre;
ALTER TABLE turnos_caja RENAME COLUMN initial_amount TO monto_inicial;
ALTER TABLE turnos_caja RENAME COLUMN expected_cash_amount TO efectivo_esperado;
ALTER TABLE turnos_caja RENAME COLUMN actual_cash_amount TO efectivo_real;
ALTER TABLE turnos_caja RENAME COLUMN difference TO diferencia;
ALTER TABLE turnos_caja RENAME COLUMN total_sales TO total_ventas;
ALTER TABLE turnos_caja RENAME COLUMN total_cash TO total_efectivo;
ALTER TABLE turnos_caja RENAME COLUMN total_transfer TO total_transferencia;
ALTER TABLE turnos_caja RENAME COLUMN total_card TO total_tarjeta;
ALTER TABLE turnos_caja RENAME COLUMN sales_count TO cantidad_ventas;
ALTER TABLE turnos_caja RENAME COLUMN status TO estado;
ALTER TABLE turnos_caja RENAME COLUMN notes TO notas;
ALTER TABLE turnos_caja RENAME COLUMN created_at TO creado_en;
ALTER TABLE turnos_caja RENAME COLUMN updated_at TO actualizado_en;

-- Functions and Triggers with CASCADE
DROP FUNCTION IF EXISTS public.calculate_shift_totals(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.calcular_totales_turno(turno_uuid uuid) RETURNS TABLE(total_ventas numeric, total_efectivo numeric, total_transferencia numeric, total_tarjeta numeric, cantidad_ventas bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(v.total), 0)::DECIMAL(10, 2) as total_ventas,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'cash' THEN v.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_efectivo,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'transfer' THEN v.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_transferencia,
        COALESCE(SUM(CASE WHEN v.metodo_pago IN ('debit_card', 'credit_card') THEN v.total ELSE 0 END), 0)::DECIMAL(10, 2) as total_tarjeta,
        COUNT(v.id) as cantidad_ventas
    FROM ventas v
    WHERE v.turno_id = turno_uuid AND v.estado = 'completed';
END;
$$;

DROP FUNCTION IF EXISTS public.generate_invoice_number() CASCADE;
CREATE OR REPLACE FUNCTION public.generar_numero_factura() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    today DATE := CURRENT_DATE;
    date_str TEXT := TO_CHAR(today, 'YYYYMMDD');
    last_number INTEGER;
    new_number TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_factura FROM '[0-9]+$') AS INTEGER)), 0)
    INTO last_number
    FROM ventas
    WHERE numero_factura LIKE 'FACT-' || date_str || '-%';
    
    new_number := 'FACT-' || date_str || '-' || LPAD((last_number + 1)::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

DROP FUNCTION IF EXISTS public.get_user_tenant_id(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.obtener_cliente_id_usuario(p_usuario_id uuid) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cliente_id UUID;
BEGIN
    SELECT id INTO v_cliente_id
    FROM clientes
    WHERE propietario_id = p_usuario_id AND active = true
    LIMIT 1;
    
    IF v_cliente_id IS NULL THEN
        SELECT t.id INTO v_cliente_id
        FROM clientes t
        INNER JOIN usuarios u ON t.propietario_id = u.id
        INNER JOIN usuario_roles ur ON u.id = ur.usuario_id
        INNER JOIN roles r ON ur.rol_id = r.id
        WHERE r.nombre = 'store_owner' AND u.id = p_usuario_id AND t.active = true
        LIMIT 1;
    END IF;
    
    RETURN v_cliente_id;
END;
$$;

DROP FUNCTION IF EXISTS public.register_stock_movement() CASCADE;
CREATE OR REPLACE FUNCTION public.registrar_movimiento_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO movimientos_stock (
        producto_id,
        tipo,
        cantidad,
        previous_quantity,
        new_quantity,
        usuario_id
    ) VALUES (
        NEW.producto_id,
        CASE 
            WHEN NEW.cantidad > OLD.cantidad THEN 'entry'
            WHEN NEW.cantidad < OLD.cantidad THEN 'exit'
            ELSE 'adjustment'
        END,
        ABS(NEW.cantidad - OLD.cantidad),
        OLD.cantidad,
        NEW.cantidad,
        current_setting('app.usuario_id', true)::UUID
    );
    
    RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.set_product_image_tenant() CASCADE;
CREATE OR REPLACE FUNCTION public.establecer_cliente_producto_imagen() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM productos
        WHERE id = NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.set_sale_item_tenant() CASCADE;
CREATE OR REPLACE FUNCTION public.establecer_cliente_venta_item() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM ventas
        WHERE id = NEW.venta_id;
    END IF;
    RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.set_stock_movement_tenant() CASCADE;
CREATE OR REPLACE FUNCTION public.establecer_cliente_movimiento_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM productos
        WHERE id = NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$;

-- Re-enable Triggers with new functions
DROP TRIGGER IF EXISTS trigger_set_product_image_tenant ON producto_imagenes;
CREATE TRIGGER trigger_establecer_cliente_producto_imagen
    BEFORE INSERT OR UPDATE ON producto_imagenes
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_producto_imagen();

DROP TRIGGER IF EXISTS trigger_set_sale_item_tenant ON venta_items;
CREATE TRIGGER trigger_establecer_cliente_venta_item
    BEFORE INSERT OR UPDATE ON venta_items
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_venta_item();

DROP TRIGGER IF EXISTS trigger_set_stock_movement_tenant ON movimientos_stock;
CREATE TRIGGER trigger_establecer_cliente_movimiento_stock
    BEFORE INSERT OR UPDATE ON movimientos_stock
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_movimiento_stock();
