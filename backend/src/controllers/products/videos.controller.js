import ProductoVideo from '../../models/ProductoVideo.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getProductVideos = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const videos = await ProductoVideo.obtenerPorProductoId(id);

    res.json({
        success: true,
        data: {
            videos,
        },
    });
});
