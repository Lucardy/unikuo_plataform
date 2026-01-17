import { verificarToken, extraerToken } from '../utils/auth.js';
import Usuario from '../models/Usuario.js';
import Cliente from '../models/Cliente.js';

/**
 * Middleware de autenticación
 * Verifica que el usuario esté autenticado
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = extraerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
      });
    }

    const decoded = verificarToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
    }

    // Obtener usuario completo de la base de datos
    // decoded.usuarioId es el nombre que pusimos en generarToken en utils/auth.js
    const usuario = await Usuario.buscarPorId(decoded.usuarioId || decoded.userId);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo',
      });
    }

    // Obtener cliente (tienda) del usuario
    let cliente = null;
    const rolesUsuario = usuario.roles || [];
    const nombresRoles = rolesUsuario.map(rol => rol.nombre || rol);

    // Si es store_owner, debe tener un cliente asignado
    if (nombresRoles.includes('store_owner')) {
      cliente = await Cliente.obtenerPorUsuarioId(usuario.id);
    }

    // Agregar información del usuario al request
    req.usuario = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      roles: Array.isArray(rolesUsuario) ? rolesUsuario : [],
      cliente_id: cliente ? cliente.id : (usuario.cliente_id || null),
    };

    // Para compatibilidad temporal con código que use req.user
    req.user = req.usuario;
    req.user.tenant_id = req.usuario.cliente_id;

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar autenticación',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Middleware para verificar roles
 */
export const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const usuario = req.usuario || req.user;
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Autenticación requerida',
        });
      }

      if (!usuario.roles || !Array.isArray(usuario.roles)) {
        return res.status(500).json({
          success: false,
          message: 'Error en la configuración de roles del usuario',
        });
      }

      const nombresRoles = usuario.roles.map(rol =>
        typeof rol === 'string' ? rol : (rol.nombre || '')
      ).filter(n => n !== '');

      const tieneRol = rolesPermitidos.some(rol => nombresRoles.includes(rol));

      if (!tieneRol) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para realizar esta acción',
        });
      }

      next();
    } catch (error) {
      console.error('Error en middleware requireRole:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos',
      });
    }
  };
};

/**
 * Middleware para validar cliente (tenant)
 */
export const requireTenant = (req, res, next) => {
  const usuario = req.usuario || req.user;
  if (!usuario) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida',
    });
  }

  const nombresRoles = usuario.roles.map(rol => rol.nombre || rol);

  // Los admins pueden acceder sin cliente específico
  if (nombresRoles.includes('admin')) {
    return next();
  }

  if (!usuario.cliente_id) {
    return res.status(403).json({
      success: false,
      message: 'No tienes un cliente (tienda) asignado. Contacta al administrador.',
    });
  }

  next();
};

/**
 * Middleware para obtener cliente desde header o query
 */
export const getTenantFromRequest = async (req, res, next) => {
  try {
    const slugCliente = req.headers['x-tenant-slug'] || req.query.tenant_slug;
    const dominioCliente = req.headers['x-tenant-domain'] || req.query.tenant_domain;

    if (slugCliente) {
      const cliente = await Cliente.obtenerPorSlug(slugCliente);
      if (cliente) {
        req.cliente = cliente;
        req.cliente_id = cliente.id;
        // Compatibilidad
        req.tenant = cliente;
        req.tenant_id = cliente.id;
      }
    } else if (dominioCliente) {
      const cliente = await Cliente.obtenerPorDominio(dominioCliente);
      if (cliente) {
        req.cliente = cliente;
        req.cliente_id = cliente.id;
        // Compatibilidad
        req.tenant = cliente;
        req.tenant_id = cliente.id;
      }
    }

    next();
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    next();
  }
};
