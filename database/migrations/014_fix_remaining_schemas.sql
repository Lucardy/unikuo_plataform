-- ============================================
-- Migración 014: Fix Remaining Schemas (Español)
-- Fecha: 2026-01-16
-- Descripción: Renombrar columnas restantes para coincidir con modelos en español
-- ============================================

BEGIN;

DO $$
BEGIN

    -- 1. TIPOS_MEDIDA (Measure Types)
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_medida' AND column_name='tenant_id') THEN
        ALTER TABLE tipos_medida RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_medida' AND column_name='name') THEN
        ALTER TABLE tipos_medida RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_medida' AND column_name='description') THEN
        ALTER TABLE tipos_medida RENAME COLUMN description TO descripcion;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_medida' AND column_name='unit') THEN
        ALTER TABLE tipos_medida RENAME COLUMN unit TO unidad;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_medida' AND column_name='active') THEN
        ALTER TABLE tipos_medida RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_medida' AND column_name='created_at') THEN
        ALTER TABLE tipos_medida RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='tipos_medida' AND column_name='updated_at') THEN
        ALTER TABLE tipos_medida RENAME COLUMN updated_at TO actualizado_en;
    END IF;


    -- 2. GENEROS (Genders)
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='generos' AND column_name='tenant_id') THEN
        ALTER TABLE generos RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='generos' AND column_name='name') THEN
        ALTER TABLE generos RENAME COLUMN name TO nombre;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='generos' AND column_name='description') THEN
        ALTER TABLE generos RENAME COLUMN description TO descripcion;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='generos' AND column_name='order_index') THEN
        ALTER TABLE generos RENAME COLUMN order_index TO orden;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='generos' AND column_name='active') THEN
        ALTER TABLE generos RENAME COLUMN active TO activo;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='generos' AND column_name='created_at') THEN
        ALTER TABLE generos RENAME COLUMN created_at TO creado_en;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='generos' AND column_name='updated_at') THEN
        ALTER TABLE generos RENAME COLUMN updated_at TO actualizado_en;
    END IF;


    -- 3. CLIENTES_FINALES (Customers)
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes_finales' AND column_name='tenant_id') THEN
        ALTER TABLE clientes_finales RENAME COLUMN tenant_id TO cliente_id;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes_finales' AND column_name='document') THEN
        ALTER TABLE clientes_finales RENAME COLUMN document TO documento;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='clientes_finales' AND column_name='birth_date') THEN
        ALTER TABLE clientes_finales RENAME COLUMN birth_date TO fecha_nacimiento;
    END IF;
    
    -- 4. MOVIMIENTOS_STOCK
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='movimientos_stock' AND column_name='previous_quantity') THEN
        ALTER TABLE movimientos_stock RENAME COLUMN previous_quantity TO cantidad_anterior;
    END IF;
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='movimientos_stock' AND column_name='new_quantity') THEN
        ALTER TABLE movimientos_stock RENAME COLUMN new_quantity TO cantidad_nueva;
    END IF;

    -- 5. REGISTROS_AUDITORIA
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='user_agent') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN user_agent TO agente_usuario;
    END IF;

END $$;

COMMIT;
