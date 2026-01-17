import Usuario from '../models/Usuario.js';
import { hashearContrasena, compararContrasena, generarToken } from '../utils/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
    const { email, password, nombre, apellido, rolesIds } = req.body;

    if (!email || !password || !nombre || !apellido) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Email inválido',
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'La contraseña debe tener al menos 6 caracteres',
        });
    }

    const existeEmail = await Usuario.existeEmail(email);
    if (existeEmail) {
        return res.status(409).json({
            success: false,
            message: 'El email ya está registrado',
        });
    }

    const contrasenaHasheada = await hashearContrasena(password);

    const usuario = await Usuario.crear({
        email,
        contrasena: contrasenaHasheada,
        nombre,
        apellido,
        rolesIds: rolesIds || [],
    });

    const token = generarToken(
        usuario.id,
        usuario.email,
        usuario.roles || [],
        usuario.cliente_id
    );

    delete usuario.contrasena;

    res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
            usuario,
            token,
        },
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email y contraseña son requeridos',
        });
    }

    const usuario = await Usuario.buscarPorEmail(email);

    if (!usuario) {
        return res.status(401).json({
            success: false,
            message: 'Credenciales inválidas',
        });
    }

    if (!usuario.activo) {
        return res.status(401).json({
            success: false,
            message: 'Usuario inactivo',
        });
    }

    const coincideContrasena = await compararContrasena(password, usuario.contrasena);

    if (!coincideContrasena) {
        return res.status(401).json({
            success: false,
            message: 'Credenciales inválidas',
        });
    }

    const token = generarToken(
        usuario.id,
        usuario.email,
        usuario.roles || [],
        usuario.cliente_id
    );

    delete usuario.contrasena;

    res.json({
        success: true,
        message: 'Login exitoso',
        data: {
            usuario,
            token,
        },
    });
});

export const getMe = asyncHandler(async (req, res) => {
    const usuario = await Usuario.buscarPorId(req.usuario.id);

    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
        });
    }

    delete usuario.contrasena;

    res.json({
        success: true,
        data: {
            usuario,
        },
    });
});

export const getRoles = asyncHandler(async (req, res) => {
    const roles = await Usuario.obtenerRoles();

    res.json({
        success: true,
        data: {
            roles,
        },
    });
});
