-- Final Renaming to Spanish and Function Updates

-- Categorias
ALTER TABLE categorias RENAME COLUMN name TO nombre;
ALTER TABLE categorias RENAME COLUMN active TO activo;
ALTER TABLE categorias RENAME COLUMN created_at TO creado_en;
ALTER TABLE categorias RENAME COLUMN updated_at TO actualizado_en;
ALTER TABLE categorias RENAME COLUMN tenant_id TO cliente_id;

-- Colores
ALTER TABLE colores RENAME COLUMN name TO nombre;
ALTER TABLE colores RENAME COLUMN order_index TO orden;
ALTER TABLE colores RENAME COLUMN active TO activo;
ALTER TABLE colores RENAME COLUMN created_at TO creado_en;
ALTER TABLE colores RENAME COLUMN updated_at TO actualizado_en;
ALTER TABLE colores RENAME COLUMN tenant_id TO cliente_id;

-- Marcas
ALTER TABLE marcas RENAME COLUMN name TO nombre;
ALTER TABLE marcas RENAME COLUMN logo_path TO url_logo;
ALTER TABLE marcas RENAME COLUMN active TO activo;
ALTER TABLE marcas RENAME COLUMN created_at TO creado_en;
ALTER TABLE marcas RENAME COLUMN updated_at TO actualizado_en;
ALTER TABLE marcas RENAME COLUMN tenant_id TO cliente_id;

-- Movimientos Stock
ALTER TABLE movimientos_stock RENAME COLUMN movement_type TO tipo;
ALTER TABLE movimientos_stock RENAME COLUMN reference TO referencia_id;

-- Producto Imagenes
ALTER TABLE producto_imagenes RENAME COLUMN filename TO nombre_archivo;
ALTER TABLE producto_imagenes RENAME COLUMN path TO ruta;
ALTER TABLE producto_imagenes RENAME COLUMN updated_at TO actualizado_en;

-- Productos
ALTER TABLE productos RENAME COLUMN category_id TO categoria_id;
ALTER TABLE productos RENAME COLUMN price TO precio;
ALTER TABLE productos RENAME COLUMN price_offer TO precio_oferta;
ALTER TABLE productos RENAME COLUMN price_transfer TO precio_transferencia;
ALTER TABLE productos RENAME COLUMN code TO codigo;
ALTER TABLE productos RENAME COLUMN status TO estado;
ALTER TABLE productos RENAME COLUMN created_at TO creado_en;
ALTER TABLE productos RENAME COLUMN updated_at TO actualizado_en;
ALTER TABLE productos RENAME COLUMN tenant_id TO cliente_id;

-- Registros Auditoria
ALTER TABLE registros_auditoria RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE registros_auditoria RENAME COLUMN data_before TO valores_antiguos;
ALTER TABLE registros_auditoria RENAME COLUMN data_after TO valores_nuevos;

-- Talles
ALTER TABLE talles RENAME COLUMN size_type_id TO tipo_talle_id;
ALTER TABLE talles RENAME COLUMN order_index TO orden;
ALTER TABLE talles RENAME COLUMN created_at TO creado_en;
ALTER TABLE talles RENAME COLUMN updated_at TO actualizado_en;
ALTER TABLE talles RENAME COLUMN tenant_id TO cliente_id;

-- Tipos Talle
ALTER TABLE tipos_talle RENAME COLUMN created_at TO creado_en;
ALTER TABLE tipos_talle RENAME COLUMN updated_at TO actualizado_en;
ALTER TABLE tipos_talle RENAME COLUMN tenant_id TO cliente_id;

-- Functions and Triggers Updates
DROP FUNCTION IF EXISTS public.calculate_shift_totals(uuid);
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

DROP FUNCTION IF EXISTS public.generate_invoice_number();
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

DROP FUNCTION IF EXISTS public.get_user_tenant_id(uuid);
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

DROP FUNCTION IF EXISTS public.register_stock_movement();
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

DROP FUNCTION IF EXISTS public.set_product_image_tenant();
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

DROP FUNCTION IF EXISTS public.set_sale_item_tenant();
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

DROP FUNCTION IF EXISTS public.set_stock_movement_tenant();
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

-- Triggers for producto_imagenes
DROP TRIGGER IF EXISTS trigger_set_product_image_tenant ON producto_imagenes;
CREATE TRIGGER trigger_establecer_cliente_producto_imagen
    BEFORE INSERT OR UPDATE ON producto_imagenes
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_producto_imagen();

-- Triggers for venta_items
DROP TRIGGER IF EXISTS trigger_set_sale_item_tenant ON venta_items;
CREATE TRIGGER trigger_establecer_cliente_venta_item
    BEFORE INSERT OR UPDATE ON venta_items
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_venta_item();

-- Triggers for movimientos_stock
DROP TRIGGER IF EXISTS trigger_set_stock_movement_tenant ON movimientos_stock;
CREATE TRIGGER trigger_establecer_cliente_movimiento_stock
    BEFORE INSERT OR UPDATE ON movimientos_stock
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_movimiento_stock();
