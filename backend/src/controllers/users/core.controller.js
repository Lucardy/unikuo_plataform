import Usuario from '../../models/Usuario.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
    const { incluir_inactivos } = req.query;
    const usuarios = await Usuario.obtenerTodos(incluir_inactivos === 'true');

    res.json({
        success: true,
        data: {
            usuarios,
        },
    });
});

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.buscarPorId(id);

    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            usuario,
        },
    });
});

export const createUser = asyncHandler(async (req, res) => {
    const { email, password, nombre, apellido, rolesIds, activo } = req.body;

    if (!email || !password || !nombre || !apellido) {
        return res.status(400).json({
            success: false,
            message: 'Email, contraseña, nombre y apellido son requeridos',
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

    const { hashearContrasena } = await import('../../utils/auth.js');
    const contrasenaHasheada = await hashearContrasena(password);

    const usuario = await Usuario.crear({
        email,
        contrasena: contrasenaHasheada,
        nombre,
        apellido,
        rolesIds: rolesIds || [],
    });

    delete usuario.contrasena;

    res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
            usuario,
        },
    });
});

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const usuarioExistente = await Usuario.buscarPorId(id);
    if (!usuarioExistente) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
        });
    }

    if (req.body.email && req.body.email !== usuarioExistente.email) {
        const existeEmail = await Usuario.existeEmail(req.body.email);
        if (existeEmail) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado',
            });
        }
    }

    const usuario = await Usuario.actualizar(id, req.body);

    if (!usuario) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
        });
    }

    delete usuario.contrasena;

    res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: {
            usuario,
        },
    });
});
