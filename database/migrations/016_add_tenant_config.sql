-- Migración 016: Configuración Visual y de Negocio para Clientes
-- Agrega columnas para personalización del frontend

ALTER TABLE clientes 
    ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS layout_config JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS componentes_config JSONB DEFAULT '{}';

-- Comentarios detallados
COMMENT ON COLUMN clientes.theme_config IS 'Configuración de colores, tipografías y estilos del tenant';
COMMENT ON COLUMN clientes.layout_config IS 'Estructura de la landing page y orden de secciones';
COMMENT ON COLUMN clientes.componentes_config IS 'Configuración específica de componentes (ej: textos del banner, links del footer)';

-- Actualizar función de auditoría si es necesario (el trigger genérico ya debería cubrirlo)
