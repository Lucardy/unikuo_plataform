import Rol from '../models/Rol.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getRoles = asyncHandler(async (req, res) => {
    const roles = await Rol.obtenerTodos();

    res.json({
        success: true,
        data: {
            roles,
        },
    });
});

export const getRoleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rol = await Rol.obtenerPorId(id);

    if (!rol) {
        return res.status(404).json({
            success: false,
            message: 'Rol no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            rol,
        },
    });
});

export const createRole = asyncHandler(async (req, res) => {
    const { nombre, descripcion } = req.body;

    // Validación básica (se mantiene por seguridad si falla middleware de ruta)
    if (!nombre) {
        // En lugar de throw, usamos res.status para consistencia o throw new Error con status 
        // pero asyncHandler capturará el throw. Return explícito es mejor aquí.
        return res.status(400).json({
            success: false,
            message: 'El nombre es requerido',
        });
    }

    const rol = await Rol.crear({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
    });

    res.status(201).json({
        success: true,
        message: 'Rol creado exitosamente',
        data: {
            rol,
        },
    });
});

export const updateRole = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Verificar que el rol existe
    const rolExistente = await Rol.obtenerPorId(id);
    if (!rolExistente) {
        return res.status(404).json({
            success: false,
            message: 'Rol no encontrado',
        });
    }

    const rol = await Rol.actualizar(id, req.body);

    if (!rol) {
        return res.status(404).json({
            success: false,
            message: 'Rol no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Rol actualizado exitosamente',
        data: {
            rol,
        },
    });
});

export const deleteRole = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Verificar que el rol existe
    const rolExistente = await Rol.obtenerPorId(id);
    if (!rolExistente) {
        return res.status(404).json({
            success: false,
            message: 'Rol no encontrado',
        });
    }

    const rol = await Rol.eliminar(id);

    if (!rol) {
        return res.status(404).json({
            success: false,
            message: 'Rol no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Rol eliminado exitosamente',
    });
});
