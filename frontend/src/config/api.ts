/**
 * Configuración de la API
 * 
 * Define la URL base del backend según el entorno
 */

const getApiUrl = (): string => {
  // En desarrollo, usar localhost
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }
  
  // En producción, usar la URL del VPS
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

export const API_CONFIG = {
  baseURL: getApiUrl(),
  timeout: 10000, // 10 segundos
};

export default API_CONFIG;
