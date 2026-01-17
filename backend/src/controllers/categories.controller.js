import Categoria from '../models/Categoria.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllCategories = asyncHandler(async (req, res) => {
    const { incluir_inactivos } = req.query;
    // Obtener cliente_id del usuario autenticado o del header
    const clienteId = req.usuario?.cliente_id || req.cliente_id || null;

    const categorias = await Categoria.obtenerTodas(incluir_inactivos === 'true', clienteId);

    res.json({
        success: true,
        data: {
            categorias,
        },
    });
});

export const getRootCategories = asyncHandler(async (req, res) => {
    const categorias = await Categoria.obtenerCategoriasRaiz();

    res.json({
        success: true,
        data: {
            categorias,
        },
    });
});

export const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const categoria = await Categoria.obtenerPorId(id);

    if (!categoria) {
        return res.status(404).json({
            success: false,
            message: 'Categoría no encontrada',
        });
    }

    res.json({
        success: true,
        data: {
            categoria,
        },
    });
});

export const getCategoryChildren = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const hijos = await Categoria.obtenerSubcategorias(id);

    res.json({
        success: true,
        data: {
            hijos,
        },
    });
});

export const createCategory = asyncHandler(async (req, res) => {
    const { nombre, descripcion, categoria_padre_id, activo } = req.body;

    if (!nombre) {
        return res.status(400).json({
            success: false,
            message: 'El nombre es requerido',
        });
    }

    // Obtener cliente_id del usuario autenticado
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si el usuario no es admin y no tiene cliente, rechazar
    if (!rolesUsuario.includes('admin') && !clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente asignado',
        });
    }

    const categoria = await Categoria.crear({
        nombre,
        descripcion,
        categoria_padre_id,
        activo,
        cliente_id: clienteId,
    });

    res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: {
            categoria,
        },
    });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, categoria_padre_id, activo } = req.body;

    const categoria = await Categoria.actualizar(id, {
        nombre,
        descripcion,
        categoria_padre_id,
        activo,
    });

    if (!categoria) {
        return res.status(404).json({
            success: false,
            message: 'Categoría no encontrada',
        });
    }

    res.json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: {
            categoria,
        },
    });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const categoria = await Categoria.eliminar(id);

    if (!categoria) {
        return res.status(404).json({
            success: false,
            message: 'Categoría no encontrada',
        });
    }

    res.json({
        success: true,
        message: 'Categoría eliminada exitosamente',
    });
});
