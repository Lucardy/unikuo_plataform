import Color from '../models/Color.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllColors = asyncHandler(async (req, res) => {
    const { incluir_inactivos } = req.query;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todos los colores (clienteId = null)
    // Si no es admin, solo ve los de su cliente
    const colores = await Color.obtenerTodos(
        incluir_inactivos === 'true',
        rolesUsuario.includes('admin') ? null : clienteId
    );

    res.json({
        success: true,
        data: {
            colores,
        },
    });
});

export const getColorById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const color = await Color.obtenerPorId(id);

    if (!color) {
        return res.status(404).json({
            success: false,
            message: 'Color no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            color,
        },
    });
});

export const createColor = asyncHandler(async (req, res) => {
    const { nombre, codigo_hex, mostrar_color, orden, activo } = req.body;

    if (!nombre) {
        return res.status(400).json({
            success: false,
            message: 'El nombre es requerido',
        });
    }

    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Permitir que admins creen colores sin cliente_id
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    if (!clienteIdFinal && !rolesUsuario.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente asignado',
        });
    }

    const color = await Color.crear({
        nombre,
        codigo_hex,
        mostrar_color,
        orden,
        activo,
        cliente_id: clienteIdFinal,
    });

    res.status(201).json({
        success: true,
        message: 'Color creado exitosamente',
        data: {
            color,
        },
    });
});

export const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el color existe y pertenece al cliente (o es admin)
    const colorExistente = await Color.obtenerPorId(id);
    if (!colorExistente) {
        return res.status(404).json({
            success: false,
            message: 'Color no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && colorExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para actualizar este color',
        });
    }

    const color = await Color.actualizar(id, req.body);

    if (!color) {
        return res.status(404).json({
            success: false,
            message: 'Color no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Color actualizado exitosamente',
        data: {
            color,
        },
    });
});

export const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el color existe y pertenece al cliente (o es admin)
    const colorExistente = await Color.obtenerPorId(id);
    if (!colorExistente) {
        return res.status(404).json({
            success: false,
            message: 'Color no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && colorExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para eliminar este color',
        });
    }

    const color = await Color.eliminar(id);

    if (!color) {
        return res.status(404).json({
            success: false,
            message: 'Color no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Color eliminado exitosamente',
    });
});
