-- Script de inicialización de la base de datos
-- Este archivo se ejecuta automáticamente cuando el contenedor de PostgreSQL se crea por primera vez

-- Crear extensión para UUIDs (útil para IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de prueba para verificar conexión
CREATE TABLE IF NOT EXISTS test_connection (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar dato de prueba
INSERT INTO test_connection (message) 
VALUES ('Base de datos inicializada correctamente')
ON CONFLICT DO NOTHING;

-- Crear tabla de ejemplo para futuras funcionalidades
-- (Puedes eliminar esto cuando empieces a crear tus propias tablas)
CREATE TABLE IF NOT EXISTS example_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en example_table
CREATE TRIGGER update_example_table_updated_at 
    BEFORE UPDATE ON example_table 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
