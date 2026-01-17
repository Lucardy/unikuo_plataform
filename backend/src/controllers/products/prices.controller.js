import PrecioCantidad from '../../models/PrecioCantidad.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getProductPrices = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || req.cliente_id || null;
    const precios = await PrecioCantidad.obtenerPorProductoId(id, clienteId);

    res.json({
        success: true,
        data: {
            precios,
        },
    });
});

export const addProductPrice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cantidad_minima, cantidad_maxima, precio, porcentaje_descuento, orden } = req.body;

    if (!cantidad_minima || !precio) {
        return res.status(400).json({
            success: false,
            message: 'La cantidad mínima y el precio son requeridos',
        });
    }

    const clienteId = req.usuario?.cliente_id;
    if (!clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente (tienda) asignado',
        });
    }

    const precioCantidad = await PrecioCantidad.crear({
        producto_id: id,
        cantidad_minima,
        cantidad_maxima,
        precio,
        porcentaje_descuento,
        orden,
        cliente_id: clienteId,
    });

    res.status(201).json({
        success: true,
        message: 'Precio por cantidad agregado exitosamente',
        data: {
            precio: precioCantidad,
        },
    });
});

export const updateProductPrice = asyncHandler(async (req, res) => {
    const { priceId } = req.params;
    const precio = await PrecioCantidad.actualizar(priceId, req.body);

    if (!precio) {
        return res.status(404).json({
            success: false,
            message: 'Precio no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Precio actualizado exitosamente',
        data: {
            precio,
        },
    });
});

export const deleteProductPrice = asyncHandler(async (req, res) => {
    const { priceId } = req.params;
    const precio = await PrecioCantidad.eliminar(priceId);

    if (!precio) {
        return res.status(404).json({
            success: false,
            message: 'Precio no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Precio eliminado exitosamente',
    });
});
