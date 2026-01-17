import Producto from '../../models/Producto.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getAllProducts = asyncHandler(async (req, res) => {
    const {
        estado,
        categoria_id,
        destacado,
        busqueda,
        limite,
        offset,
    } = req.query;

    const filtros = {};
    if (estado) filtros.estado = estado;
    if (categoria_id) filtros.categoria_id = categoria_id;
    if (destacado !== undefined) filtros.destacado = destacado === 'true';
    if (busqueda) filtros.busqueda = busqueda;
    if (limite) filtros.limite = parseInt(limite);
    if (offset) filtros.offset = parseInt(offset);

    // Agregar cliente_id para filtrar por cliente
    filtros.cliente_id = req.usuario?.cliente_id || req.cliente_id || null;

    const productos = await Producto.obtenerTodos(filtros);
    const total = await Producto.contar(filtros);

    res.json({
        success: true,
        data: {
            productos,
            total,
            limite: filtros.limite || null,
            offset: filtros.offset || null,
        },
    });
});

export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const producto = await Producto.obtenerPorId(id);

    if (!producto) {
        return res.status(404).json({
            success: false,
            message: 'Producto no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            producto,
        },
    });
});

export const createProduct = asyncHandler(async (req, res) => {
    const {
        categoria_id,
        nombre,
        descripcion,
        precio,
        precio_oferta,
        precio_transferencia,
        codigo,
        estado,
        destacado,
    } = req.body;

    if (!nombre || !precio) {
        return res.status(400).json({
            success: false,
            message: 'Nombre y precio son requeridos',
        });
    }

    const clienteId = req.usuario?.cliente_id;
    const rolesUsuario = (req.usuario?.roles || []).map(rol => rol.nombre || rol);

    if (!rolesUsuario.includes('admin') && !clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente (tienda) asignado',
        });
    }

    if (codigo) {
        const existeCodigo = await Producto.existeCodigo(codigo, null, clienteId);
        if (existeCodigo) {
            return res.status(409).json({
                success: false,
                message: 'El código ya está en uso',
            });
        }
    }

    const producto = await Producto.crear({
        categoria_id,
        nombre,
        descripcion,
        precio,
        precio_oferta,
        precio_transferencia,
        codigo,
        estado,
        destacado,
        cliente_id: clienteId,
    });

    res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: {
            producto,
        },
    });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const datosActualizacion = req.body;

    if (datosActualizacion.codigo) {
        const clienteId = req.usuario?.cliente_id;
        const existeCodigo = await Producto.existeCodigo(datosActualizacion.codigo, id, clienteId);
        if (existeCodigo) {
            return res.status(409).json({
                success: false,
                message: 'El código ya está en uso',
            });
        }
    }

    const producto = await Producto.actualizar(id, datosActualizacion);

    if (!producto) {
        return res.status(404).json({
            success: false,
            message: 'Producto no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: {
            producto,
        },
    });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const producto = await Producto.eliminar(id);

    if (!producto) {
        return res.status(404).json({
            success: false,
            message: 'Producto no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
    });
});
