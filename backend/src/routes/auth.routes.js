import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/me
 * Obtener información del usuario autenticado
 */
router.get('/me', authenticate, authController.getMe);

/**
 * GET /api/auth/roles
 * Obtener todos los roles disponibles
 */
router.get('/roles', authController.getRoles);

export default router;
