import asyncHandler from '../utils/asyncHandler.js';

/**
 * Middleware para verificar si el usuario es Super Admin
 */
export const verificarSuperAdmin = asyncHandler(async (req, res, next) => {
    // Asumimos que el middleware de autenticación (verificarToken) ya se ejecutó
    // y req.usuario y req.usuario.roles existen.

    if (!req.usuario || !req.usuario.roles) {
        res.status(403);
        throw new Error('Acceso denegado: Usuario no autenticado correctamente');
    }

    const esSuperAdmin = req.usuario.roles.some(rol => rol.nombre === 'super_admin');

    if (!esSuperAdmin) {
        res.status(403);
        throw new Error('Acceso denegado: Se requieren permisos de Super Administrador');
    }

    next();
});
