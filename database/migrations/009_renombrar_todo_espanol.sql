-- ============================================
-- Migración 009: Renombrar TODO a Español (SUPER ROBUSTA IDEMPOTENTE)
-- Fecha: 2026-01-16
-- Descripción: Refactorización completa usando DO blocks para evitar errores en BBDD inconsistentes
-- ============================================

BEGIN;

-- ============================================
-- PASO 1: RENOMBRAR TABLAS
-- ============================================

DO $$
BEGIN
    -- users -> usuarios
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'users') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'usuarios') THEN
        ALTER TABLE users RENAME TO usuarios;
    END IF;

    -- user_roles -> usuario_roles
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'user_roles') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'usuario_roles') THEN
        ALTER TABLE user_roles RENAME TO usuario_roles;
    END IF;

    -- tenants -> clientes
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'tenants') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'clientes') THEN
        ALTER TABLE tenants RENAME TO clientes;
    END IF;

    -- audit_logs -> registros_auditoria
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'registros_auditoria') THEN
        ALTER TABLE audit_logs RENAME TO registros_auditoria;
    END IF;

    -- categories -> categorias
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'categories') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'categorias') THEN
        ALTER TABLE categories RENAME TO categorias;
    END IF;

    -- brands -> marcas
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'brands') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'marcas') THEN
        ALTER TABLE brands RENAME TO marcas;
    END IF;

    -- colors -> colores
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'colors') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'colores') THEN
        ALTER TABLE colors RENAME TO colores;
    END IF;

    -- sizes -> talles
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'sizes') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'talles') THEN
        ALTER TABLE sizes RENAME TO talles;
    END IF;

    -- size_types -> tipos_talle
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'size_types') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'tipos_talle') THEN
        ALTER TABLE size_types RENAME TO tipos_talle;
    END IF;

    -- genders -> generos
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'genders') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'generos') THEN
        ALTER TABLE genders RENAME TO generos;
    END IF;

    -- measure_types -> tipos_medida
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'measure_types') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'tipos_medida') THEN
        ALTER TABLE measure_types RENAME TO tipos_medida;
    END IF;

    -- products -> productos
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'products') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'productos') THEN
        ALTER TABLE products RENAME TO productos;
    END IF;

    -- product_images -> producto_imagenes
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'product_images') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'producto_imagenes') THEN
        ALTER TABLE product_images RENAME TO producto_imagenes;
    END IF;

    -- product_videos -> producto_videos
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'product_videos') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'producto_videos') THEN
        ALTER TABLE product_videos RENAME TO producto_videos;
    END IF;

    -- product_stock -> producto_stock
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'product_stock') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'producto_stock') THEN
        ALTER TABLE product_stock RENAME TO producto_stock;
    END IF;

    -- product_brands -> producto_marcas
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'product_brands') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'producto_marcas') THEN
        ALTER TABLE product_brands RENAME TO producto_marcas;
    END IF;

    -- product_colors -> producto_colores
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'product_colors') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'producto_colores') THEN
        ALTER TABLE product_colors RENAME TO producto_colores;
    END IF;

    -- product_sizes -> producto_talles
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'product_sizes') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'producto_talles') THEN
        ALTER TABLE product_sizes RENAME TO producto_talles;
    END IF;

    -- price_quantity -> precio_cantidad
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'price_quantity') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'precio_cantidad') THEN
        ALTER TABLE price_quantity RENAME TO precio_cantidad;
    END IF;

    -- stock_movements -> movimientos_stock
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'stock_movements') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'movimientos_stock') THEN
        ALTER TABLE stock_movements RENAME TO movimientos_stock;
    END IF;

    -- customers -> clientes_finales
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'customers') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'clientes_finales') THEN
        ALTER TABLE customers RENAME TO clientes_finales;
    END IF;

    -- sales -> ventas
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'sales') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'ventas') THEN
        ALTER TABLE sales RENAME TO ventas;
    END IF;

    -- sale_items -> venta_items
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'sale_items') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'venta_items') THEN
        ALTER TABLE sale_items RENAME TO venta_items;
    END IF;

    -- cash_register_shifts -> turnos_caja
    IF EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'cash_register_shifts') AND NOT EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'turnos_caja') THEN
        ALTER TABLE cash_register_shifts RENAME TO turnos_caja;
    END IF;

END $$;

-- ============================================
-- PASO 2: RENOMBRAR COLUMNAS (Usando helper)
-- ============================================

DO $$
DECLARE
    -- Helper function logic inline
    rename_col text;
BEGIN
    -- users / usuarios
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='first_name') THEN
        ALTER TABLE usuarios RENAME COLUMN first_name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='last_name') THEN
        ALTER TABLE usuarios RENAME COLUMN last_name TO apellido;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='password') THEN
        ALTER TABLE usuarios RENAME COLUMN password TO contrasena;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='active') THEN
        ALTER TABLE usuarios RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='tenant_id') THEN
        ALTER TABLE usuarios RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='created_at') THEN
        ALTER TABLE usuarios RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='updated_at') THEN
        ALTER TABLE usuarios RENAME COLUMN updated_at TO actualizado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='email_verified') THEN
        ALTER TABLE usuarios RENAME COLUMN email_verified TO email_verificado;
    END IF;

    -- roles (table exists as 'roles')
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='roles' AND column_name='name') THEN
        ALTER TABLE roles RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='roles' AND column_name='description') THEN
        ALTER TABLE roles RENAME COLUMN description TO descripcion;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='roles' AND column_name='created_at') THEN
        ALTER TABLE roles RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='roles' AND column_name='updated_at') THEN
        ALTER TABLE roles RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- usuario_roles
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuario_roles' AND column_name='user_id') THEN
        ALTER TABLE usuario_roles RENAME COLUMN user_id TO usuario_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuario_roles' AND column_name='role_id') THEN
        ALTER TABLE usuario_roles RENAME COLUMN role_id TO rol_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='usuario_roles' AND column_name='created_at') THEN
        ALTER TABLE usuario_roles RENAME COLUMN created_at TO creado_en;
    END IF;

    -- clientes (tenants)
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='name') THEN
        ALTER TABLE clientes RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='phone') THEN
        ALTER TABLE clientes RENAME COLUMN phone TO telefono;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='domain') THEN
        ALTER TABLE clientes RENAME COLUMN domain TO dominio;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='active') THEN
        ALTER TABLE clientes RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='owner_id') THEN
        ALTER TABLE clientes RENAME COLUMN owner_id TO propietario_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='created_at') THEN
        ALTER TABLE clientes RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='updated_at') THEN
        ALTER TABLE clientes RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- registros_auditoria
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='user_id') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN user_id TO usuario_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='action') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN action TO accion;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='table_name') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN table_name TO nombre_tabla;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='record_id') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN record_id TO registro_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='old_values') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN old_values TO valores_antiguos;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='new_values') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN new_values TO valores_nuevos;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='ip_address') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN ip_address TO direccion_ip;
    END IF;
     IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='created_at') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN created_at TO creado_en;
    END IF;

    -- categorias
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='name') THEN
        ALTER TABLE categorias RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='description') THEN
        ALTER TABLE categorias RENAME COLUMN description TO descripcion;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='image_url') THEN
        ALTER TABLE categorias RENAME COLUMN image_url TO url_imagen;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='active') THEN
        ALTER TABLE categorias RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='tenant_id') THEN
        ALTER TABLE categorias RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='created_at') THEN
        ALTER TABLE categorias RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='updated_at') THEN
        ALTER TABLE categorias RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- marcas
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='marcas' AND column_name='name') THEN
        ALTER TABLE marcas RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='marcas' AND column_name='description') THEN
        ALTER TABLE marcas RENAME COLUMN description TO descripcion;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='marcas' AND column_name='logo_url') THEN
        ALTER TABLE marcas RENAME COLUMN logo_url TO url_logo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='marcas' AND column_name='active') THEN
        ALTER TABLE marcas RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='marcas' AND column_name='tenant_id') THEN
        ALTER TABLE marcas RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='marcas' AND column_name='created_at') THEN
        ALTER TABLE marcas RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='marcas' AND column_name='updated_at') THEN
        ALTER TABLE marcas RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- colores
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='name') THEN
        ALTER TABLE colores RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='hex_code') THEN
        ALTER TABLE colores RENAME COLUMN hex_code TO codigo_hex;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='active') THEN
        ALTER TABLE colores RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='tenant_id') THEN
        ALTER TABLE colores RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='created_at') THEN
        ALTER TABLE colores RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='updated_at') THEN
        ALTER TABLE colores RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- talles
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='name') THEN
        ALTER TABLE talles RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='size_type_id') THEN
        ALTER TABLE talles RENAME COLUMN size_type_id TO tipo_talle_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='order_index') THEN
        ALTER TABLE talles RENAME COLUMN order_index TO orden;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='active') THEN
        ALTER TABLE talles RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='tenant_id') THEN
        ALTER TABLE talles RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='created_at') THEN
        ALTER TABLE talles RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='updated_at') THEN
        ALTER TABLE talles RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- tipos_talle
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_talle' AND column_name='name') THEN
        ALTER TABLE tipos_talle RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_talle' AND column_name='description') THEN
        ALTER TABLE tipos_talle RENAME COLUMN description TO descripcion;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_talle' AND column_name='active') THEN
        ALTER TABLE tipos_talle RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_talle' AND column_name='tenant_id') THEN
        ALTER TABLE tipos_talle RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_talle' AND column_name='created_at') THEN
        ALTER TABLE tipos_talle RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_talle' AND column_name='updated_at') THEN
        ALTER TABLE tipos_talle RENAME COLUMN updated_at TO actualizado_en;
    END IF;

     -- productos
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='name') THEN
        ALTER TABLE productos RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='description') THEN
        ALTER TABLE productos RENAME COLUMN description TO descripcion;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='category_id') THEN
        ALTER TABLE productos RENAME COLUMN category_id TO categoria_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='gender_id') THEN
        ALTER TABLE productos RENAME COLUMN gender_id TO genero_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='measure_type_id') THEN
        ALTER TABLE productos RENAME COLUMN measure_type_id TO tipo_medida_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='base_price') THEN
        ALTER TABLE productos RENAME COLUMN base_price TO precio_base;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='cost_price') THEN
        ALTER TABLE productos RENAME COLUMN cost_price TO precio_costo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='active') THEN
        ALTER TABLE productos RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='featured') THEN
        ALTER TABLE productos RENAME COLUMN featured TO destacado;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='tenant_id') THEN
        ALTER TABLE productos RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='created_at') THEN
        ALTER TABLE productos RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='updated_at') THEN
        ALTER TABLE productos RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- producto_imagenes
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_imagenes' AND column_name='product_id') THEN
        ALTER TABLE producto_imagenes RENAME COLUMN product_id TO producto_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_imagenes' AND column_name='image_url') THEN
        ALTER TABLE producto_imagenes RENAME COLUMN image_url TO url_imagen;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_imagenes' AND column_name='alt_text') THEN
        ALTER TABLE producto_imagenes RENAME COLUMN alt_text TO texto_alt;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_imagenes' AND column_name='order_index') THEN
        ALTER TABLE producto_imagenes RENAME COLUMN order_index TO orden;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_imagenes' AND column_name='is_primary') THEN
        ALTER TABLE producto_imagenes RENAME COLUMN is_primary TO es_principal;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_imagenes' AND column_name='tenant_id') THEN
        ALTER TABLE producto_imagenes RENAME COLUMN tenant_id TO cliente_id;
    END IF;
     IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='producto_imagenes' AND column_name='created_at') THEN
        ALTER TABLE producto_imagenes RENAME COLUMN created_at TO creado_en;
    END IF;

   -- ventas
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='invoice_number') THEN
        ALTER TABLE ventas RENAME COLUMN invoice_number TO numero_factura;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='customer_id') THEN
        ALTER TABLE ventas RENAME COLUMN customer_id TO cliente_final_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='user_id') THEN
        ALTER TABLE ventas RENAME COLUMN user_id TO usuario_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='shift_id') THEN
        ALTER TABLE ventas RENAME COLUMN shift_id TO turno_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='sale_date') THEN
        ALTER TABLE ventas RENAME COLUMN sale_date TO fecha_venta;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='discount') THEN
        ALTER TABLE ventas RENAME COLUMN discount TO descuento;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='tax') THEN
        ALTER TABLE ventas RENAME COLUMN tax TO impuesto;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='payment_method') THEN
        ALTER TABLE ventas RENAME COLUMN payment_method TO metodo_pago;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='status') THEN
        ALTER TABLE ventas RENAME COLUMN status TO estado;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='notes') THEN
        ALTER TABLE ventas RENAME COLUMN notes TO notas;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='tenant_id') THEN
        ALTER TABLE ventas RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='created_at') THEN
        ALTER TABLE ventas RENAME COLUMN created_at TO creado_en;
    END IF;
     IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='updated_at') THEN
        ALTER TABLE ventas RENAME COLUMN updated_at TO actualizado_en;
    END IF;


END $$;

-- ============================================
-- PASO 28: ACTUALIZAR FUNCIONES Y TRIGGERS (Recrearlas siempre es seguro si usamos OR REPLACE y DROP)
-- ============================================

-- Función para calcular totales de turno
DROP FUNCTION IF EXISTS calculate_shift_totals(UUID) CASCADE;
DROP FUNCTION IF EXISTS calcular_totales_turno(UUID) CASCADE;
CREATE OR REPLACE FUNCTION calcular_totales_turno(p_turno_id UUID)
RETURNS TABLE (
    total_ventas DECIMAL(10,2),
    total_efectivo DECIMAL(10,2),
    total_transferencia DECIMAL(10,2),
    total_tarjeta DECIMAL(10,2),
    cantidad_ventas INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(v.total), 0)::DECIMAL(10,2) as total_ventas,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'cash' THEN v.total ELSE 0 END), 0)::DECIMAL(10,2) as total_efectivo,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'transfer' THEN v.total ELSE 0 END), 0)::DECIMAL(10,2) as total_transferencia,
        COALESCE(SUM(CASE WHEN v.metodo_pago = 'card' THEN v.total ELSE 0 END), 0)::DECIMAL(10,2) as total_tarjeta,
        COUNT(*)::INTEGER as cantidad_ventas
    FROM ventas v
    WHERE v.turno_id = p_turno_id AND v.estado != 'cancelled';
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de factura
DROP FUNCTION IF EXISTS generate_invoice_number() CASCADE;
DROP FUNCTION IF EXISTS generar_numero_factura() CASCADE;
CREATE OR REPLACE FUNCTION generar_numero_factura()
RETURNS TEXT AS $$
DECLARE
    v_year TEXT;
    v_month TEXT;
    v_sequence INTEGER;
    v_invoice_number TEXT;
BEGIN
    v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    v_month := TO_CHAR(CURRENT_DATE, 'MM');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_factura FROM 10) AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM ventas
    WHERE numero_factura LIKE v_year || v_month || '%';
    
    v_invoice_number := v_year || v_month || LPAD(v_sequence::TEXT, 6, '0');
    
    RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener tenant_id de un usuario
DROP FUNCTION IF EXISTS get_user_tenant_id(UUID) CASCADE;
DROP FUNCTION IF EXISTS obtener_cliente_id_usuario(UUID) CASCADE;
CREATE OR REPLACE FUNCTION obtener_cliente_id_usuario(p_usuario_id UUID)
RETURNS UUID AS $$
DECLARE
    v_cliente_id UUID;
BEGIN
    SELECT id INTO v_cliente_id
    FROM clientes
    WHERE propietario_id = p_usuario_id AND activo = true
    LIMIT 1;
    
    IF v_cliente_id IS NULL THEN
        SELECT t.id INTO v_cliente_id
        FROM clientes t
        INNER JOIN usuarios u ON t.propietario_id = u.id
        INNER JOIN usuario_roles ur ON u.id = ur.usuario_id
        INNER JOIN roles r ON ur.rol_id = r.id
        WHERE r.nombre = 'store_owner' AND u.id = p_usuario_id AND t.activo = true
        LIMIT 1;
    END IF;
    
    RETURN v_cliente_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para producto_imagenes
DROP TRIGGER IF EXISTS trigger_set_product_image_tenant ON producto_imagenes CASCADE;
DROP FUNCTION IF EXISTS set_product_image_tenant() CASCADE;
DROP FUNCTION IF EXISTS establecer_cliente_producto_imagen() CASCADE;

CREATE OR REPLACE FUNCTION establecer_cliente_producto_imagen()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM productos
        WHERE id = NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_establecer_cliente_producto_imagen
    BEFORE INSERT OR UPDATE ON producto_imagenes
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_producto_imagen();

-- Trigger para venta_items
DROP TRIGGER IF EXISTS trigger_set_sale_item_tenant ON venta_items CASCADE;
DROP FUNCTION IF EXISTS set_sale_item_tenant() CASCADE;
DROP FUNCTION IF EXISTS establecer_cliente_venta_item() CASCADE;

CREATE OR REPLACE FUNCTION establecer_cliente_venta_item()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM ventas
        WHERE id = NEW.venta_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_establecer_cliente_venta_item
    BEFORE INSERT OR UPDATE ON venta_items
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_venta_item();

-- Trigger para movimientos_stock
DROP TRIGGER IF EXISTS trigger_set_stock_movement_tenant ON movimientos_stock CASCADE;
DROP FUNCTION IF EXISTS set_stock_movement_tenant() CASCADE;
DROP FUNCTION IF EXISTS establecer_cliente_movimiento_stock() CASCADE;

CREATE OR REPLACE FUNCTION establecer_cliente_movimiento_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cliente_id IS NULL THEN
        SELECT cliente_id INTO NEW.cliente_id
        FROM productos
        WHERE id = NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_establecer_cliente_movimiento_stock
    BEFORE INSERT OR UPDATE ON movimientos_stock
    FOR EACH ROW
    EXECUTE FUNCTION establecer_cliente_movimiento_stock();

COMMIT;
