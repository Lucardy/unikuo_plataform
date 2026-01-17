import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as colorsController from '../controllers/colors.controller.js';

const router = express.Router();

/**
 * GET /api/colors
 * Obtener todos los colores
 */
router.get('/', authenticate, colorsController.getAllColors);

/**
 * GET /api/colors/:id
 * Obtener color por ID
 */
router.get('/:id', authenticate, colorsController.getColorById);

/**
 * POST /api/colors
 * Crear nuevo color (requiere autenticación)
 */
router.post('/', authenticate, colorsController.createColor);

/**
 * PUT /api/colors/:id
 * Actualizar color (requiere autenticación)
 */
router.put('/:id', authenticate, colorsController.updateColor);

/**
 * DELETE /api/colors/:id
 * Eliminar color (requiere autenticación - soft delete)
 */
router.delete('/:id', authenticate, colorsController.deleteColor);

export default router;
