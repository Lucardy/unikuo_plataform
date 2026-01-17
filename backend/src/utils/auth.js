import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-key-cambiar-en-produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Genera un token JWT para un usuario
 */
export const generarToken = (usuarioId, email, roles = [], clienteId = null) => {
  const payload = {
    usuarioId,
    email,
    roles,
    clienteId,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifica y decodifica un token JWT
 */
export const verificarToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Hashea una contraseña
 */
export const hashearContrasena = async (contrasena) => {
  const saltRounds = 10;
  return await bcrypt.hash(contrasena, saltRounds);
};

/**
 * Compara una contraseña con un hash
 */
export const compararContrasena = async (contrasena, hash) => {
  return await bcrypt.compare(contrasena, hash);
};

/**
 * Extrae el token del header Authorization
 */
export const extraerToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};
