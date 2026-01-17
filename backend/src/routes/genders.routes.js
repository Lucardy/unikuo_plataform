import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as gendersController from '../controllers/genders.controller.js';

const router = express.Router();

/**
 * GET /api/genders
 * Obtener todos los géneros
 */
router.get('/', authenticate, gendersController.getAllGenders);

/**
 * GET /api/genders/:id
 * Obtener género por ID
 */
router.get('/:id', authenticate, gendersController.getGenderById);

/**
 * POST /api/genders
 * Crear nuevo género (requiere autenticación)
 */
router.post('/', authenticate, gendersController.createGender);

/**
 * PUT /api/genders/:id
 * Actualizar género (requiere autenticación)
 */
router.put('/:id', authenticate, gendersController.updateGender);

/**
 * DELETE /api/genders/:id
 * Eliminar género (requiere autenticación - soft delete)
 */
router.delete('/:id', authenticate, gendersController.deleteGender);

export default router;
