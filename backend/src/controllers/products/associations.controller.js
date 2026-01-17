import Marca from '../../models/Marca.js';
import Talle from '../../models/Talle.js';
import Color from '../../models/Color.js';
import asyncHandler from '../../utils/asyncHandler.js';

// ============================================
// MÉTODOS DE MARCAS
// ============================================

export const associateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { marca_id } = req.body;

    const resultado = await Marca.asociarAProducto(id, marca_id);

    if (!resultado) {
        return res.status(409).json({
            success: false,
            message: 'La marca ya está asociada al producto',
        });
    }

    res.status(201).json({
        success: true,
        message: 'Marca asociada exitosamente',
    });
});

export const disassociateBrand = asyncHandler(async (req, res) => {
    const { id, brandId } = req.params;
    const resultado = await Marca.desasociarDeProducto(id, brandId);

    if (!resultado) {
        return res.status(404).json({
            success: false,
            message: 'La marca no está asociada al producto',
        });
    }

    res.json({
        success: true,
        message: 'Marca desasociada exitosamente',
    });
});

// ============================================
// MÉTODOS DE TALLES
// ============================================

export const associateSize = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { talle_id } = req.body;

    const resultado = await Talle.asociarAProducto(id, talle_id);

    if (!resultado) {
        return res.status(409).json({
            success: false,
            message: 'El talle ya está asociado al producto',
        });
    }

    res.status(201).json({
        success: true,
        message: 'Talle asociado exitosamente',
    });
});

export const disassociateSize = asyncHandler(async (req, res) => {
    const { id, sizeId } = req.params;
    const resultado = await Talle.desasociarDeProducto(id, sizeId);

    if (!resultado) {
        return res.status(404).json({
            success: false,
            message: 'El talle no está asociado al producto',
        });
    }

    res.json({
        success: true,
        message: 'Talle desasociado exitosamente',
    });
});

// ============================================
// MÉTODOS DE COLORES
// ============================================

export const associateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { color_id } = req.body;

    const resultado = await Color.asociarAProducto(id, color_id);

    if (!resultado) {
        return res.status(409).json({
            success: false,
            message: 'El color ya está asociado al producto',
        });
    }

    res.status(201).json({
        success: true,
        message: 'Color asociado exitosamente',
    });
});

export const disassociateColor = asyncHandler(async (req, res) => {
    const { id, colorId } = req.params;
    const resultado = await Color.desasociarDeProducto(id, colorId);

    if (!resultado) {
        return res.status(404).json({
            success: false,
            message: 'El color no está asociado al producto',
        });
    }

    res.json({
        success: true,
        message: 'Color desasociado exitosamente',
    });
});
