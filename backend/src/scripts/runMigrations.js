import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'unikuo_plataform',
  user: process.env.DB_USER || 'unikuo_user',
  password: process.env.DB_PASSWORD || 'unikuo_password',
  connectionTimeoutMillis: 10000,
});

/**
 * Crear tabla de migraciones si no existe
 */
async function ensureMigrationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
}

/**
 * Obtener migraciones ya ejecutadas
 */
async function getExecutedMigrations() {
  const result = await pool.query('SELECT filename FROM migrations ORDER BY filename');
  return result.rows.map(row => row.filename);
}

/**
 * Ejecutar una migración
 */
async function runMigration(filename, sql) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Ejecutar el SQL de la migración
    await client.query(sql);
    
    // Registrar la migración
    await client.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
    
    await client.query('COMMIT');
    console.log(`✅ Migración ejecutada: ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Error ejecutando migración ${filename}:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Obtener todas las migraciones pendientes
 */
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../../../../database/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('📁 No existe la carpeta de migraciones, creándola...');
    fs.mkdirSync(migrationsDir, { recursive: true });
    return [];
  }
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ordenar alfabéticamente (001, 002, 003...)
  
  return files.map(file => ({
    filename: file,
    path: path.join(migrationsDir, file),
  }));
}

/**
 * Función principal
 */
async function runMigrations() {
  try {
    console.log('🚀 Iniciando migraciones de base de datos...\n');
    
    // Asegurar que existe la tabla de migraciones
    await ensureMigrationsTable();
    
    // Obtener migraciones ejecutadas
    const executedMigrations = await getExecutedMigrations();
    console.log(`📋 Migraciones ya ejecutadas: ${executedMigrations.length}`);
    
    // Obtener todas las migraciones disponibles
    const migrationFiles = getMigrationFiles();
    console.log(`📁 Migraciones encontradas: ${migrationFiles.length}\n`);
    
    if (migrationFiles.length === 0) {
      console.log('ℹ️  No hay migraciones para ejecutar.');
      process.exit(0);
    }
    
    // Filtrar migraciones pendientes
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file.filename)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Todas las migraciones ya están ejecutadas.');
      process.exit(0);
    }
    
    console.log(`🔄 Migraciones pendientes: ${pendingMigrations.length}\n`);
    
    // Ejecutar cada migración pendiente
    for (const migration of pendingMigrations) {
      console.log(`📝 Ejecutando: ${migration.filename}...`);
      const sql = fs.readFileSync(migration.path, 'utf8');
      await runMigration(migration.filename, sql);
    }
    
    console.log(`\n✅ ¡Todas las migraciones se ejecutaron correctamente!`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error ejecutando migraciones:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar
runMigrations();
