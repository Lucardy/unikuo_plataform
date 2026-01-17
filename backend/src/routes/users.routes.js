import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as usersController from '../controllers/users.controller.js';

const router = express.Router();

/**
 * GET /api/users
 * Obtener todos los usuarios (requiere autenticación y rol admin)
 */
router.get('/', authenticate, requireRole(['admin']), usersController.getAllUsers);

/**
 * GET /api/users/roles
 * Obtener todos los roles disponibles (requiere autenticación y rol admin)
 */
router.get('/roles', authenticate, requireRole(['admin']), usersController.getAllRoles);

/**
 * GET /api/users/:id
 * Obtener usuario por ID (requiere autenticación y rol admin)
 */
router.get('/:id', authenticate, requireRole(['admin']), usersController.getUserById);

/**
 * POST /api/users
 * Crear nuevo usuario (requiere autenticación y rol admin)
 */
router.post('/', authenticate, requireRole(['admin']), usersController.createUser);

/**
 * PUT /api/users/:id
 * Actualizar usuario (requiere autenticación y rol admin)
 */
router.put('/:id', authenticate, requireRole(['admin']), usersController.updateUser);

/**
 * PUT /api/users/:id/password
 * Cambiar contraseña de usuario (requiere autenticación y rol admin)
 */
router.put('/:id/password', authenticate, requireRole(['admin']), usersController.changeUserPassword);

/**
 * PUT /api/users/:id/activate
 * Activar usuario (requiere autenticación y rol admin)
 */
router.put('/:id/activate', authenticate, requireRole(['admin']), usersController.activateUser);

/**
 * PUT /api/users/:id/deactivate
 * Desactivar usuario (requiere autenticación y rol admin)
 */
router.put('/:id/deactivate', authenticate, requireRole(['admin']), usersController.deactivateUser);

export default router;
