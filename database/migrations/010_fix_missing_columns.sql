-- ============================================
-- Migración 010: Fix Missing Columns and Renames
-- Fecha: 2026-01-16
-- Descripción: Asegura que existan columna cliente_id y renombra columnas faltantes en tablas de detalle
-- ============================================

BEGIN;

DO $$
BEGIN
    -- 1. CATEGORIAS: Asegurar cliente_id
    IF NOT EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='cliente_id') THEN
        -- Si existe tenant_id, lo renombramos (esto debió ocurrir en 009 pero por seguridad)
        IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='tenant_id') THEN
            ALTER TABLE categorias RENAME COLUMN tenant_id TO cliente_id;
        ELSE
            -- Si no existe ninguno, creamos cliente_id
            ALTER TABLE categorias ADD COLUMN cliente_id UUID;
        END IF;
    END IF;

    -- 2. PRODUCTOS: Asegurar cliente_id
    IF NOT EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='cliente_id') THEN
        IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='tenant_id') THEN
            ALTER TABLE productos RENAME COLUMN tenant_id TO cliente_id;
        ELSE
            ALTER TABLE productos ADD COLUMN cliente_id UUID;
        END IF;
    END IF;

    -- 3. PRODUCTO_STOCK: Renombres que faltaron en 009
    -- product_id -> producto_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_stock' AND column_name='product_id') THEN
        ALTER TABLE producto_stock RENAME COLUMN product_id TO producto_id;
    END IF;
    -- quantity -> cantidad
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_stock' AND column_name='quantity') THEN
        ALTER TABLE producto_stock RENAME COLUMN quantity TO cantidad;
    END IF;
    -- min_stock -> stock_minimo
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_stock' AND column_name='min_stock') THEN
        ALTER TABLE producto_stock RENAME COLUMN min_stock TO stock_minimo;
    END IF;
    -- max_stock -> stock_maximo
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_stock' AND column_name='max_stock') THEN
        ALTER TABLE producto_stock RENAME COLUMN max_stock TO stock_maximo;
    END IF;
    -- tenant_id -> cliente_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_stock' AND column_name='tenant_id') THEN
        ALTER TABLE producto_stock RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    -- created_at -> creado_en
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_stock' AND column_name='created_at') THEN
        ALTER TABLE producto_stock RENAME COLUMN created_at TO creado_en;
    END IF;
     -- updated_at -> actualizado_en
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_stock' AND column_name='updated_at') THEN
        ALTER TABLE producto_stock RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- 3.1 VENTA_ITEMS: Renombres que faltaron
    -- sale_id -> venta_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='sale_id') THEN
        ALTER TABLE venta_items RENAME COLUMN sale_id TO venta_id;
    END IF;
    -- product_id -> producto_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='product_id') THEN
        ALTER TABLE venta_items RENAME COLUMN product_id TO producto_id;
    END IF;
    -- quantity -> cantidad
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='quantity') THEN
        ALTER TABLE venta_items RENAME COLUMN quantity TO cantidad;
    END IF;
    -- unit_price -> precio_unitario
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='unit_price') THEN
        ALTER TABLE venta_items RENAME COLUMN unit_price TO precio_unitario;
    END IF;
    -- total -> precio_total (sometimes called total_price)
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='total_price') THEN
        ALTER TABLE venta_items RENAME COLUMN total_price TO precio_total;
    END IF;
     IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='total') THEN
        ALTER TABLE venta_items RENAME COLUMN total TO precio_total;
    END IF;

    -- 4. MOVIMIENTOS_STOCK: Renombres
    -- product_id -> producto_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='movimientos_stock' AND column_name='product_id') THEN
        ALTER TABLE movimientos_stock RENAME COLUMN product_id TO producto_id;
    END IF;
    -- type -> tipo
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='movimientos_stock' AND column_name='type') THEN
        ALTER TABLE movimientos_stock RENAME COLUMN type TO tipo;
    END IF;
    -- quantity -> cantidad
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='movimientos_stock' AND column_name='quantity') THEN
        ALTER TABLE movimientos_stock RENAME COLUMN quantity TO cantidad;
    END IF;
    -- reason -> razon (o motivo)
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='movimientos_stock' AND column_name='reason') THEN
        ALTER TABLE movimientos_stock RENAME COLUMN reason TO razon;
    END IF;
    -- user_id -> usuario_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='movimientos_stock' AND column_name='user_id') THEN
        ALTER TABLE movimientos_stock RENAME COLUMN user_id TO usuario_id;
    END IF;
    -- tenant_id -> cliente_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='movimientos_stock' AND column_name='tenant_id') THEN
        ALTER TABLE movimientos_stock RENAME COLUMN tenant_id TO cliente_id;
    END IF;

    -- 5. TURNOS_CAJA: Renombres
    -- user_id -> usuario_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='turnos_caja' AND column_name='user_id') THEN
        ALTER TABLE turnos_caja RENAME COLUMN user_id TO usuario_id;
    END IF;
    -- start_time -> fecha_inicio
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='turnos_caja' AND column_name='start_time') THEN
        ALTER TABLE turnos_caja RENAME COLUMN start_time TO fecha_inicio;
    END IF;
    -- end_time -> fecha_fin
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='turnos_caja' AND column_name='end_time') THEN
        ALTER TABLE turnos_caja RENAME COLUMN end_time TO fecha_fin;
    END IF;
    -- initial_amount -> monto_inicial
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='turnos_caja' AND column_name='initial_amount') THEN
        ALTER TABLE turnos_caja RENAME COLUMN initial_amount TO monto_inicial;
    END IF;
    -- final_amount -> monto_final
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='turnos_caja' AND column_name='final_amount') THEN
        ALTER TABLE turnos_caja RENAME COLUMN final_amount TO monto_final;
    END IF;
    -- status -> estado
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='turnos_caja' AND column_name='status') THEN
        ALTER TABLE turnos_caja RENAME COLUMN status TO estado;
    END IF;
    -- tenant_id -> cliente_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='turnos_caja' AND column_name='tenant_id') THEN
        ALTER TABLE turnos_caja RENAME COLUMN tenant_id TO cliente_id;
    END IF;


    -- Asegurar que producto_stock tenga stock_maximo si no existía como max_stock
    IF NOT EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_stock' AND column_name='stock_maximo') THEN
         ALTER TABLE producto_stock ADD COLUMN stock_maximo INTEGER DEFAULT 0;
    END IF;

END $$;

COMMIT;
