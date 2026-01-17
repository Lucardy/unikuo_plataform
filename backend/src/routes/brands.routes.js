import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as brandsController from '../controllers/brands.controller.js';

const router = express.Router();

/**
 * GET /api/brands
 * Obtener todas las marcas
 */
router.get('/', authenticate, brandsController.getAllBrands);

/**
 * GET /api/brands/:id
 * Obtener marca por ID
 */
router.get('/:id', authenticate, brandsController.getBrandById);

/**
 * POST /api/brands
 * Crear nueva marca (requiere autenticación)
 */
router.post('/', authenticate, brandsController.createBrand);

/**
 * PUT /api/brands/:id
 * Actualizar marca (requiere autenticación)
 */
router.put('/:id', authenticate, brandsController.updateBrand);

/**
 * DELETE /api/brands/:id
 * Eliminar marca (requiere autenticación - soft delete)
 */
router.delete('/:id', authenticate, brandsController.deleteBrand);

export default router;
