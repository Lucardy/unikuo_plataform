import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as sizeTypesController from '../controllers/size-types.controller.js';
import * as sizesController from '../controllers/sizes.controller.js';

const router = express.Router();

// ============================================
// RUTAS DE TIPOS DE TALLE
// ============================================

/**
 * GET /api/sizes/types
 * Obtener todos los tipos de talle
 */
router.get('/types', authenticate, sizeTypesController.getAllSizeTypes);

/**
 * GET /api/sizes/types/:id
 * Obtener tipo de talle por ID
 */
router.get('/types/:id', sizeTypesController.getSizeTypeById);

/**
 * POST /api/sizes/types
 * Crear nuevo tipo de talle (requiere autenticación)
 */
router.post('/types', authenticate, sizeTypesController.createSizeType);

/**
 * PUT /api/sizes/types/:id
 * Actualizar tipo de talle (requiere autenticación)
 */
router.put('/types/:id', authenticate, sizeTypesController.updateSizeType);

/**
 * DELETE /api/sizes/types/:id
 * Eliminar tipo de talle (requiere autenticación - soft delete)
 */
router.delete('/types/:id', authenticate, sizeTypesController.deleteSizeType);

// ============================================
// RUTAS DE TALLES
// ============================================

/**
 * GET /api/sizes
 * Obtener todos los talles (opcionalmente filtrados por tipo)
 */
router.get('/', authenticate, sizesController.getAllSizes);

/**
 * GET /api/sizes/:id
 * Obtener talle por ID
 */
router.get('/:id', sizesController.getSizeById);

/**
 * POST /api/sizes
 * Crear nuevo talle (requiere autenticación)
 */
router.post('/', authenticate, sizesController.createSize);

/**
 * PUT /api/sizes/:id
 * Actualizar talle (requiere autenticación)
 */
router.put('/:id', authenticate, sizesController.updateSize);

/**
 * DELETE /api/sizes/:id
 * Eliminar talle (requiere autenticación)
 */
router.delete('/:id', authenticate, sizesController.deleteSize);

export default router;
