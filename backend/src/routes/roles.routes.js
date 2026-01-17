import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateRequiredFields } from '../middleware/validate.js';
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} from '../controllers/roles.controller.js';

const router = express.Router();

/**
 * GET /api/roles
 * Obtener todos los roles (requiere autenticación)
 */
router.get('/', authenticate, getRoles);

/**
 * GET /api/roles/:id
 * Obtener rol por ID (requiere autenticación)
 */
router.get('/:id', authenticate, getRoleById);

/**
 * POST /api/roles
 * Crear nuevo rol (requiere autenticación y rol admin)
 */
router.post('/', authenticate, requireRole(['admin']), validateRequiredFields(['nombre']), createRole);

/**
 * PUT /api/roles/:id
 * Actualizar rol (requiere autenticación y rol admin)
 */
router.put('/:id', authenticate, requireRole(['admin']), updateRole);

/**
 * DELETE /api/roles/:id
 * Eliminar rol (requiere autenticación y rol admin)
 */
router.delete('/:id', authenticate, requireRole(['admin']), deleteRole);

export default router;
