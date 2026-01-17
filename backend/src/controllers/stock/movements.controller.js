import MovimientoStock from '../../models/MovimientoStock.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getAllMovements = asyncHandler(async (req, res) => {
    const { producto_id, tipo, usuario_id, limite, offset } = req.query;

    const movimientos = await MovimientoStock.findAll({
        producto_id,
        tipo,
        usuario_id,
        limite: limite ? parseInt(limite) : 100,
        offset: offset ? parseInt(offset) : 0,
        cliente_id: req.usuario?.cliente_id || null,
    });

    res.json({
        success: true,
        data: {
            movimientos,
        },
    });
});

export const getProductMovements = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { limite } = req.query;
    const clienteId = req.usuario?.cliente_id;

    const movimientos = await MovimientoStock.findByProductId(id, limite ? parseInt(limite) : 50, clienteId);

    res.json({
        success: true,
        data: {
            movimientos,
        },
    });
});
