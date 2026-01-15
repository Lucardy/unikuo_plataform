import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno (.env.local tiene prioridad si existe)
dotenv.config({ path: '.env.local' });
dotenv.config(); // .env como fallback

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Crear backup de la base de datos antes de migraciones
 */
async function backupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'database',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'unikuo_plataform',
    user: process.env.DB_USER || 'unikuo_user',
    password: process.env.DB_PASSWORD || 'unikuo_password',
  });

  try {
    await client.connect();
    console.log('📦 Creando backup de la base de datos...\n');

    // Crear directorio de backups si no existe
    const backupsDir = path.join(__dirname, '../../../database/backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Nombre del archivo con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupFile = path.join(backupsDir, `backup-${timestamp}.sql`);

    // Obtener todas las tablas
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    const tables = tablesResult.rows.map(row => row.tablename);
    
    if (tables.length === 0) {
      console.log('⚠️  No hay tablas para hacer backup.');
      return;
    }

    console.log(`📋 Tablas encontradas: ${tables.length}`);
    
    let backupContent = `-- Backup creado el ${new Date().toISOString()}\n`;
    backupContent += `-- Base de datos: ${process.env.DB_NAME || 'unikuo_plataform'}\n\n`;

    // Para cada tabla, obtener estructura y datos
    for (const table of tables) {
      console.log(`  📄 Respaldando tabla: ${table}...`);
      
      // Obtener estructura de la tabla
      const createTableResult = await client.query(`
        SELECT 
          'CREATE TABLE IF NOT EXISTS ' || quote_ident(table_name) || ' (' ||
          string_agg(
            quote_ident(column_name) || ' ' || 
            CASE 
              WHEN data_type = 'USER-DEFINED' THEN udt_name
              WHEN data_type = 'ARRAY' THEN udt_name || '[]'
              ELSE data_type
            END ||
            CASE 
              WHEN is_nullable = 'NO' THEN ' NOT NULL'
              ELSE ''
            END ||
            CASE 
              WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default
              ELSE ''
            END,
            ', '
          ) || ');' as create_statement
        FROM information_schema.columns
        WHERE table_name = $1
        AND table_schema = 'public'
        GROUP BY table_name;
      `, [table]);

      if (createTableResult.rows.length > 0) {
        backupContent += `\n-- Tabla: ${table}\n`;
        backupContent += createTableResult.rows[0].create_statement + '\n\n';
      }

      // Obtener datos de la tabla
      const dataResult = await client.query(`SELECT * FROM ${table}`);
      
      if (dataResult.rows.length > 0) {
        backupContent += `-- Datos de la tabla ${table}\n`;
        
        for (const row of dataResult.rows) {
          const columns = Object.keys(row);
          const values = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            return val;
          });
          
          backupContent += `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;\n`;
        }
        backupContent += '\n';
      }
    }

    // Guardar backup
    fs.writeFileSync(backupFile, backupContent, 'utf8');
    
    const fileSize = (fs.statSync(backupFile).size / 1024).toFixed(2);
    console.log(`\n✅ Backup creado exitosamente!`);
    console.log(`📁 Archivo: ${backupFile}`);
    console.log(`📊 Tamaño: ${fileSize} KB`);
    console.log(`\n💡 Para restaurar, ejecuta: psql -U unikuo_user -d unikuo_plataform < ${backupFile}`);
    
  } catch (error) {
    console.error('❌ Error creando backup:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

backupDatabase();
