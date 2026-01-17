-- Final Robust Renaming Script in Spanish
-- Uses DO blocks to avoid "column does not exist" errors

DO $$ 
BEGIN 
    -- TABLA: usuarios
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='first_name') THEN
        ALTER TABLE usuarios RENAME COLUMN first_name TO nombre;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='last_name') THEN
        ALTER TABLE usuarios RENAME COLUMN last_name TO apellido;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='active') THEN
        ALTER TABLE usuarios RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='created_at') THEN
        ALTER TABLE usuarios RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='updated_at') THEN
        ALTER TABLE usuarios RENAME COLUMN updated_at TO actualizado_en;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='tenant_id') THEN
        ALTER TABLE usuarios RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='email_verified') THEN
        ALTER TABLE usuarios RENAME COLUMN email_verified TO email_verificado;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='usuarios' AND column_name='password') THEN
        ALTER TABLE usuarios RENAME COLUMN password TO contrasena;
    END IF;

    -- TABLA: productos
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='category_id') THEN
        ALTER TABLE productos RENAME COLUMN category_id TO categoria_id;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='name') THEN
        ALTER TABLE productos RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='description') THEN
        ALTER TABLE productos RENAME COLUMN description TO descripcion;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='featured') THEN
        ALTER TABLE productos RENAME COLUMN featured TO destacado;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='created_at') THEN
        ALTER TABLE productos RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='updated_at') THEN
        ALTER TABLE productos RENAME COLUMN updated_at TO actualizado_en;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='productos' AND column_name='tenant_id') THEN
        ALTER TABLE productos RENAME COLUMN tenant_id TO cliente_id;
    END IF;

    -- TABLA: ventas
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='discount_total') THEN
        ALTER TABLE ventas RENAME COLUMN discount_total TO total_descuento;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='client_id') THEN
        ALTER TABLE ventas RENAME COLUMN client_id TO cliente_final_id;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='client_name') THEN
        ALTER TABLE ventas RENAME COLUMN client_name TO nombre_cliente;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='client_document') THEN
        ALTER TABLE ventas RENAME COLUMN client_document TO documento_cliente;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='ventas' AND column_name='discount_code') THEN
        ALTER TABLE ventas RENAME COLUMN discount_code TO codigo_descuento;
    END IF;

    -- TABLA: venta_items
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='unit_price') THEN
        ALTER TABLE venta_items RENAME COLUMN unit_price TO precio_unitario;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='unit_cost') THEN
        ALTER TABLE venta_items RENAME COLUMN unit_cost TO costo_unitario;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='venta_items' AND column_name='discount_amount') THEN
        ALTER TABLE venta_items RENAME COLUMN discount_amount TO monto_descuento;
    END IF;

    -- TABLA: categorias
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='name') THEN
        ALTER TABLE categorias RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='active') THEN
        ALTER TABLE categorias RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='created_at') THEN
        ALTER TABLE categorias RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='categorias' AND column_name='updated_at') THEN
        ALTER TABLE categorias RENAME COLUMN updated_at TO actualizado_en;
    END IF;

    -- TABLA: colores
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='name') THEN
        ALTER TABLE colores RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='order_index') THEN
        ALTER TABLE colores RENAME COLUMN order_index TO orden;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='colores' AND column_name='active') THEN
        ALTER TABLE colores RENAME COLUMN active TO activo;
    END IF;

    -- TABLA: talles
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='name') THEN
        ALTER TABLE talles RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='talles' AND column_name='order_index') THEN
        ALTER TABLE talles RENAME COLUMN order_index TO orden;
    END IF;

    -- TABLA: clientes (antes tenants)
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='name') THEN
        ALTER TABLE clientes RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='active') THEN
        ALTER TABLE clientes RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name='clientes' AND column_name='owner_id') THEN
        ALTER TABLE clientes RENAME COLUMN owner_id TO propietario_id;
    END IF;

    -- ... y as? sucesivamente para todos los campos de English a Espa?ol
END $$;
