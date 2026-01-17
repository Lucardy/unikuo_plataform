import Genero from '../models/Genero.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllGenders = asyncHandler(async (req, res) => {
    const { incluir_inactivos } = req.query;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todos los géneros (clienteId = null)
    // Si no es admin, solo ve los de su cliente
    const generos = await Genero.obtenerTodos(
        incluir_inactivos === 'true',
        rolesUsuario.includes('admin') ? null : clienteId
    );

    res.json({
        success: true,
        data: {
            generos,
        },
    });
});

export const getGenderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const genero = await Genero.obtenerPorId(id);

    if (!genero) {
        return res.status(404).json({
            success: false,
            message: 'Género no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            genero,
        },
    });
});

export const createGender = asyncHandler(async (req, res) => {
    const { nombre, descripcion, orden, activo } = req.body;

    if (!nombre) {
        return res.status(400).json({
            success: false,
            message: 'El nombre es requerido',
        });
    }

    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Permitir que admins creen géneros sin cliente_id
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    if (!clienteIdFinal && !rolesUsuario.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente asignado',
        });
    }

    const genero = await Genero.crear({
        nombre,
        descripcion,
        orden,
        activo,
        cliente_id: clienteIdFinal,
    });

    res.status(201).json({
        success: true,
        message: 'Género creado exitosamente',
        data: {
            genero,
        },
    });
});

export const updateGender = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el género existe y pertenece al cliente (o es admin)
    const generoExistente = await Genero.obtenerPorId(id);
    if (!generoExistente) {
        return res.status(404).json({
            success: false,
            message: 'Género no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && generoExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para actualizar este género',
        });
    }

    const genero = await Genero.actualizar(id, req.body);

    if (!genero) {
        return res.status(404).json({
            success: false,
            message: 'Género no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Género actualizado exitosamente',
        data: {
            genero,
        },
    });
});

export const deleteGender = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el género existe y pertenece al cliente (o es admin)
    const generoExistente = await Genero.obtenerPorId(id);
    if (!generoExistente) {
        return res.status(404).json({
            success: false,
            message: 'Género no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && generoExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para eliminar este género',
        });
    }

    const genero = await Genero.eliminar(id);

    if (!genero) {
        return res.status(404).json({
            success: false,
            message: 'Género no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Género eliminado exitosamente',
        data: {
            genero,
        },
    });
});
