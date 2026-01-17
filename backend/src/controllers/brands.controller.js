import Marca from '../models/Marca.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllBrands = asyncHandler(async (req, res) => {
    const { incluir_inactivos } = req.query;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todas las marcas (clienteId = null)
    // Si no es admin, solo ve las de su cliente
    const marcas = await Marca.obtenerTodas(
        incluir_inactivos === 'true',
        rolesUsuario.includes('admin') ? null : clienteId
    );

    res.json({
        success: true,
        data: {
            marcas,
        },
    });
});

export const getBrandById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const marca = await Marca.obtenerPorId(id);

    if (!marca) {
        return res.status(404).json({
            success: false,
            message: 'Marca no encontrada',
        });
    }

    res.json({
        success: true,
        data: {
            marca,
        },
    });
});

export const createBrand = asyncHandler(async (req, res) => {
    const { nombre, descripcion, url_logo, activo } = req.body;

    if (!nombre) {
        return res.status(400).json({
            success: false,
            message: 'El nombre es requerido',
        });
    }

    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Permitir que admins creen marcas sin cliente_id
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    if (!clienteIdFinal && !rolesUsuario.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente asignado',
        });
    }

    const marca = await Marca.crear({
        nombre,
        descripcion,
        url_logo,
        activo,
        cliente_id: clienteIdFinal,
    });

    res.status(201).json({
        success: true,
        message: 'Marca creada exitosamente',
        data: {
            marca,
        },
    });
});

export const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que la marca existe y pertenece al cliente (o es admin)
    const marcaExistente = await Marca.obtenerPorId(id);
    if (!marcaExistente) {
        return res.status(404).json({
            success: false,
            message: 'Marca no encontrada',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && marcaExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para actualizar esta marca',
        });
    }

    const marca = await Marca.actualizar(id, req.body);

    if (!marca) {
        return res.status(404).json({
            success: false,
            message: 'Marca no encontrada',
        });
    }

    res.json({
        success: true,
        message: 'Marca actualizada exitosamente',
        data: {
            marca,
        },
    });
});

export const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que la marca existe y pertenece al cliente (o es admin)
    const marcaExistente = await Marca.obtenerPorId(id);
    if (!marcaExistente) {
        return res.status(404).json({
            success: false,
            message: 'Marca no encontrada',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && marcaExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para eliminar esta marca',
        });
    }

    const marca = await Marca.eliminar(id);

    if (!marca) {
        return res.status(404).json({
            success: false,
            message: 'Marca no encontrada',
        });
    }

    res.json({
        success: true,
        message: 'Marca eliminada exitosamente',
    });
});
