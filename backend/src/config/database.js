import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'unikuo_plataform',
  user: process.env.DB_USER || 'unikuo_user',
  password: process.env.DB_PASSWORD || 'unikuo_password',
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Manejo de errores del pool
pool.on('error', (err, client) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    return {
      success: true,
      message: 'Conexión a PostgreSQL exitosa',
      timestamp: result.rows[0].now,
    };
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error);
    return {
      success: false,
      message: 'Error al conectar con PostgreSQL',
      error: error.message,
    };
  }
};

// Función para obtener datos de prueba
export const getTestData = async () => {
  try {
    const result = await pool.query('SELECT * FROM test_connection ORDER BY created_at DESC LIMIT 1');
    return {
      success: true,
      data: result.rows[0] || null,
    };
  } catch (error) {
    console.error('Error al obtener datos de prueba:', error);
    return {
      success: false,
      message: 'Error al obtener datos de prueba',
      error: error.message,
    };
  }
};

// Exportar el pool para usar en otras partes de la aplicación
export default pool;
