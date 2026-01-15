import cors from 'cors';
import config from '../config/config.js';

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (como Postman, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar si el origin está en la lista de permitidos
    if (config.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // En desarrollo, permitir cualquier origin para facilitar el testing
      if (config.nodeEnv === 'development') {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
