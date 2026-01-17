-- ============================================
-- Migración 015: Fix Audit and Product related Schema issues
-- Fecha: 2026-01-16
-- Descripción: Ajustar columnas de registros_auditoria para coincidir con el modelo.
-- ============================================

BEGIN;

DO $$
BEGIN

    -- 1. REGISTROS_AUDITORIA
    -- Rename valores_antiguos -> datos_antes
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='valores_antiguos') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN valores_antiguos TO datos_antes;
    END IF;

    -- Rename valores_nuevos -> datos_despues
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='registros_auditoria' AND column_name='valores_nuevos') THEN
        ALTER TABLE registros_auditoria RENAME COLUMN valores_nuevos TO datos_despues;
    END IF;

END $$;

COMMIT;
