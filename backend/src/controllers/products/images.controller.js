import ProductoImagen from '../../models/ProductoImagen.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getProductImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const imagenes = await ProductoImagen.obtenerPorProductoId(id);

    res.json({
        success: true,
        data: {
            imagenes,
        },
    });
});

export const addProductImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre_archivo, ruta, es_principal, orden } = req.body;

    if (!ruta) {
        return res.status(400).json({
            success: false,
            message: 'La ruta de la imagen es requerida',
        });
    }

    const imagen = await ProductoImagen.crear({
        producto_id: id,
        nombre_archivo,
        ruta,
        es_principal,
        orden,
    });

    res.status(201).json({
        success: true,
        message: 'Imagen agregada exitosamente',
        data: {
            imagen,
        },
    });
});

export const updateProductImage = asyncHandler(async (req, res) => {
    const { id, imageId } = req.params;
    const { nombre_archivo, ruta, es_principal, orden } = req.body;

    const imagen = await ProductoImagen.actualizar(imageId, {
        producto_id: id,
        nombre_archivo,
        ruta,
        es_principal,
        orden,
    });

    if (!imagen) {
        return res.status(404).json({
            success: false,
            message: 'Imagen no encontrada',
        });
    }

    res.json({
        success: true,
        message: 'Imagen actualizada exitosamente',
        data: {
            imagen,
        },
    });
});

export const deleteProductImage = asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    const imagen = await ProductoImagen.eliminar(imageId);

    if (!imagen) {
        return res.status(404).json({
            success: false,
            message: 'Imagen no encontrada',
        });
    }

    res.json({
        success: true,
        message: 'Imagen eliminada exitosamente',
    });
});

export const setPrimaryImage = asyncHandler(async (req, res) => {
    const { id, imageId } = req.params;
    const resultado = await ProductoImagen.establecerPrincipal(imageId, id);

    if (!resultado) {
        return res.status(404).json({
            success: false,
            message: 'Imagen no encontrada',
        });
    }

    res.json({
        success: true,
        message: 'Imagen principal actualizada exitosamente',
    });
});
