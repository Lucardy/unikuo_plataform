import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as categoriesController from '../controllers/categories.controller.js';

const router = express.Router();

/**
 * GET /api/categories
 * Obtener todas las categorías
 */
router.get('/', categoriesController.getAllCategories);

/**
 * GET /api/categories/root
 * Obtener categorías raíz (sin categoria_padre_id)
 */
router.get('/root', categoriesController.getRootCategories);

/**
 * GET /api/categories/:id
 * Obtener categoría por ID
 */
router.get('/:id', categoriesController.getCategoryById);

/**
 * GET /api/categories/:id/children
 * Obtener subcategorías de una categoría
 */
router.get('/:id/children', categoriesController.getCategoryChildren);

/**
 * POST /api/categories
 * Crear nueva categoría (requiere autenticación)
 */
router.post('/', authenticate, categoriesController.createCategory);

/**
 * PUT /api/categories/:id
 * Actualizar categoría (requiere autenticación)
 */
router.put('/:id', authenticate, categoriesController.updateCategory);

/**
 * DELETE /api/categories/:id
 * Eliminar categoría (requiere autenticación - soft delete)
 */
router.delete('/:id', authenticate, categoriesController.deleteCategory);

export default router;
