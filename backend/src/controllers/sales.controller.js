import Venta from '../models/Venta.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllSales = asyncHandler(async (req, res) => {
    const {
        estado,
        usuario_id,
        fecha_inicio,
        fecha_fin,
        limite,
        offset,
    } = req.query;

    const filtros = {};
    if (estado) filtros.estado = estado;
    if (usuario_id) filtros.usuario_id = usuario_id;
    if (fecha_inicio) filtros.fecha_inicio = fecha_inicio;
    if (fecha_fin) filtros.fecha_fin = fecha_fin;
    if (limite) filtros.limite = parseInt(limite);
    if (offset) filtros.offset = parseInt(offset);

    // Agregar cliente_id para filtrar por tienda (cliente)
    const clienteId = req.usuario?.cliente_id || null;
    filtros.cliente_id = clienteId;

    const ventas = await Venta.obtenerTodas(filtros);
    const total = await Venta.contar(filtros);

    res.json({
        success: true,
        data: {
            ventas,
            total,
            limite: filtros.limite || null,
            offset: filtros.offset || null,
        },
    });
});

export const getSaleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const venta = await Venta.obtenerPorId(id);

    if (!venta) {
        return res.status(404).json({
            success: false,
            message: 'Venta no encontrada',
        });
    }

    res.json({
        success: true,
        data: {
            venta,
        },
    });
});

export const createSale = asyncHandler(async (req, res) => {
    const {
        cliente_final_id,
        nombre_cliente,
        documento_cliente,
        metodo_pago,
        codigo_descuento,
        estado,
        notas,
        items,
    } = req.body;

    // Validaciones
    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'La venta debe tener al menos un item',
        });
    }

    // Validar items
    for (const item of items) {
        if (!item.producto_id || !item.cantidad || !item.precio_unitario) {
            return res.status(400).json({
                success: false,
                message: 'Cada item debe tener producto_id, cantidad y precio_unitario',
            });
        }
    }

    const clienteId = req.usuario?.cliente_id;
    if (!clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente (tienda) asignado',
        });
    }

    const venta = await Venta.crear({
        usuario_id: req.usuario.id,
        cliente_final_id,
        nombre_cliente,
        documento_cliente,
        metodo_pago,
        codigo_descuento,
        estado,
        notas,
        items,
        cliente_id: clienteId,
    });

    res.status(201).json({
        success: true,
        message: 'Venta creada exitosamente',
        data: {
            venta,
        },
    });
});

export const cancelSale = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const venta = await Venta.cancelar(id);

    if (!venta) {
        return res.status(404).json({
            success: false,
            message: 'Venta no encontrada',
        });
    }

    res.json({
        success: true,
        message: 'Venta cancelada exitosamente',
        data: {
            venta,
        },
    });
});
