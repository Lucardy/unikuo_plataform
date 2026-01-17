import StockProducto from '../../models/StockProducto.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getAllStock = asyncHandler(async (req, res) => {
    const { stock_bajo } = req.query;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todos los stocks (clienteId = null)
    // Si no es admin, solo ve los de su cliente
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    const stock = await StockProducto.findAll(clienteIdFinal, stock_bajo === 'true');

    res.json({
        success: true,
        data: {
            stock,
        },
    });
});

export const getStockStatistics = asyncHandler(async (req, res) => {
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todas las estadísticas (clienteId = null)
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    const estadisticas = await StockProducto.getStatistics(clienteIdFinal);

    res.json({
        success: true,
        data: {
            estadisticas,
        },
    });
});

export const getStockByProductId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id;
    const stock = await StockProducto.findByProductId(id, clienteId);

    if (!stock) {
        return res.json({
            success: true,
            data: {
                stock: null,
                message: 'No hay stock registrado para este producto',
            },
        });
    }

    res.json({
        success: true,
        data: {
            stock,
        },
    });
});

export const getLowStock = asyncHandler(async (req, res) => {
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todos los stocks bajos (clienteId = null)
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    const stockBajo = await StockProducto.findLowStock(clienteIdFinal);

    res.json({
        success: true,
        data: {
            productos: stockBajo,
            total: stockBajo.length,
        },
    });
});
