import Banner from '../models/Banner.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import asyncHandler from '../utils/asyncHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllBanners = asyncHandler(async (req, res) => {
    const { incluir_inactivos } = req.query;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todos los banners (clienteId = null)
    // Si no es admin, solo ve los de su cliente
    const banners = await Banner.obtenerTodos(
        incluir_inactivos === 'true',
        rolesUsuario.includes('admin') ? null : clienteId
    );

    res.json({
        success: true,
        data: {
            banners,
        },
    });
});

export const getBannerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    const banner = await Banner.obtenerPorId(
        id,
        rolesUsuario.includes('admin') ? null : clienteId
    );

    if (!banner) {
        return res.status(404).json({
            success: false,
            message: 'Banner no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            banner,
        },
    });
});

export const uploadBannerImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No se proporcionó ninguna imagen',
        });
    }

    // Ruta relativa para guardar en la base de datos
    const rutaImagen = `uploads/banners/${req.file.filename}`;

    res.json({
        success: true,
        data: {
            path: rutaImagen,
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
        },
    });
});

export const createBanner = asyncHandler(async (req, res) => {
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Permitir que admins creen banners sin cliente_id
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    const banner = await Banner.crear(req.body, clienteIdFinal);

    res.status(201).json({
        success: true,
        message: 'Banner creado exitosamente',
        data: {
            banner,
        },
    });
});

export const updateBanner = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el banner existe y pertenece al cliente (o es admin)
    const bannerExistente = await Banner.obtenerPorId(
        id,
        rolesUsuario.includes('admin') ? null : clienteId
    );

    if (!bannerExistente) {
        return res.status(404).json({
            success: false,
            message: 'Banner no encontrado',
        });
    }

    const banner = await Banner.actualizar(
        id,
        req.body,
        rolesUsuario.includes('admin') ? null : clienteId
    );

    res.json({
        success: true,
        message: 'Banner actualizado exitosamente',
        data: {
            banner,
        },
    });
});

export const deleteBanner = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el banner existe y pertenece al cliente (o es admin)
    const bannerExistente = await Banner.obtenerPorId(
        id,
        rolesUsuario.includes('admin') ? null : clienteId
    );

    if (!bannerExistente) {
        return res.status(404).json({
            success: false,
            message: 'Banner no encontrado',
        });
    }

    // Eliminar archivo de imagen si existe
    if (bannerExistente.url_imagen) {
        // Necesitamos subir dos niveles desde controllers para llegar a backend root, luego a uploads
        const rutaImagen = path.join(__dirname, '../../', bannerExistente.url_imagen);
        if (fs.existsSync(rutaImagen)) {
            try {
                fs.unlinkSync(rutaImagen);
            } catch (err) {
                console.error('Error al eliminar archivo de imagen:', err);
            }
        }
    }

    const eliminado = await Banner.eliminar(
        id,
        rolesUsuario.includes('admin') ? null : clienteId
    );

    if (!eliminado) {
        return res.status(404).json({
            success: false,
            message: 'Banner no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Banner eliminado exitosamente',
    });
});
