import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const config = {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // URLs
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // CORS - Orígenes permitidos
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:5173', // Vite dev server
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
      ],

  // Base de datos (para más adelante)
  // database: {
  //   host: process.env.DB_HOST || 'localhost',
  //   name: process.env.DB_NAME || 'unikuo_plataform',
  //   user: process.env.DB_USER || 'root',
  //   password: process.env.DB_PASSWORD || '',
  // },
};

export default config;
