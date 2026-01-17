import StockProducto from '../../models/StockProducto.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const upsertStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cantidad, stock_minimo, stock_maximo } = req.body;

    if (cantidad === undefined) {
        return res.status(400).json({
            success: false,
            message: 'La cantidad es requerida',
        });
    }

    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Permitir que admins creen stock sin cliente_id
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    if (!clienteIdFinal && !rolesUsuario.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente asignado',
        });
    }

    const stock = await StockProducto.upsert(id, {
        cantidad,
        stock_minimo: stock_minimo || 0,
        stock_maximo: stock_maximo || 0,
        cliente_id: clienteIdFinal,
    });

    res.status(201).json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: {
            stock,
        },
    });
});

export const addStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cantidad, razon } = req.body;
    const usuarioId = req.usuario.id;

    if (!cantidad || cantidad <= 0) {
        return res.status(400).json({
            success: false,
            message: 'La cantidad debe ser mayor a 0',
        });
    }

    const stock = await StockProducto.addStock(id, cantidad, razon, usuarioId);

    res.json({
        success: true,
        message: 'Stock agregado exitosamente',
        data: {
            stock,
        },
    });
});

export const reduceStock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cantidad, razon } = req.body;
    const usuarioId = req.usuario.id;

    if (!cantidad || cantidad <= 0) {
        return res.status(400).json({
            success: false,
            message: 'La cantidad debe ser mayor a 0',
        });
    }

    const stock = await StockProducto.reduceStock(id, cantidad, razon, usuarioId);

    res.json({
        success: true,
        message: 'Stock reducido exitosamente',
        data: {
            stock,
        },
    });
});
