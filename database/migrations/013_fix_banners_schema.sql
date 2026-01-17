-- ============================================
-- Migración 013: Fix Banners Schema (Español)
-- Fecha: 2026-01-16
-- Descripción: Renombrar columnas de banners para coincidir con el modelo en español
-- ============================================

BEGIN;

DO $$
BEGIN
    -- tenant_id -> cliente_id
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='tenant_id') THEN
        ALTER TABLE banners RENAME COLUMN tenant_id TO cliente_id;
    END IF;

    -- description -> subtitulo (assuming description was used for subtitle)
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='description') THEN
        ALTER TABLE banners RENAME COLUMN description TO subtitulo;
    END IF;

    -- image -> url_imagen
     IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='image') THEN
        ALTER TABLE banners RENAME COLUMN image TO url_imagen;
    END IF;
    -- image_url -> url_imagen (alternative name just in case)
     IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='image_url') THEN
        ALTER TABLE banners RENAME COLUMN image_url TO url_imagen;
    END IF;

    -- url -> url_enlace
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='url') THEN
        ALTER TABLE banners RENAME COLUMN url TO url_enlace;
    END IF;
    -- link_url -> url_enlace
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='link_url') THEN
        ALTER TABLE banners RENAME COLUMN link_url TO url_enlace;
    END IF;

    -- active -> activo (ya parece estar en activo, pero por seguridad)
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='active') THEN
        ALTER TABLE banners RENAME COLUMN active TO activo;
    END IF;

    -- created_at -> creado_en
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='created_at') THEN
        ALTER TABLE banners RENAME COLUMN created_at TO creado_en;
    END IF;

    -- updated_at -> actualizado_en
    IF EXISTS(SELECT FROM information_schema.columns WHERE table_name='banners' AND column_name='updated_at') THEN
        ALTER TABLE banners RENAME COLUMN updated_at TO actualizado_en;
    END IF;

END $$;

COMMIT;
