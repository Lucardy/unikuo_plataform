import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';
import * as bannersController from '../controllers/banners.controller.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/banners');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
    }
  },
});

/**
 * GET /api/banners
 * Obtener todos los banners
 */
router.get('/', authenticate, bannersController.getAllBanners);

/**
 * GET /api/banners/:id
 * Obtener banner por ID
 */
router.get('/:id', authenticate, bannersController.getBannerById);

/**
 * POST /api/banners/upload
 * Subir imagen de banner
 */
router.post('/upload', authenticate, upload.single('imagen'), bannersController.uploadBannerImage);

/**
 * POST /api/banners
 * Crear un nuevo banner
 */
router.post('/', authenticate, bannersController.createBanner);

/**
 * PUT /api/banners/:id
 * Actualizar un banner
 */
router.put('/:id', authenticate, bannersController.updateBanner);

/**
 * DELETE /api/banners/:id
 * Eliminar un banner
 */
router.delete('/:id', authenticate, bannersController.deleteBanner);

export default router;
