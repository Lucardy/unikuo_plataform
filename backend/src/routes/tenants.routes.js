import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as tenantsController from '../controllers/tenants.controller.js';

const router = express.Router();

/**
 * GET /api/tenants
 * Obtener todos los clientes (solo admin)
 */
router.get('/', authenticate, requireRole(['admin']), tenantsController.getAllTenants);

/**
 * GET /api/tenants/my
 * Obtener cliente del usuario actual
 */
router.get('/my', authenticate, tenantsController.getMyTenant);

/**
 * GET /api/tenants/:id
 * Obtener cliente por ID (solo admin o el mismo cliente)
 */
router.get('/:id', authenticate, tenantsController.getTenantById);

/**
 * POST /api/tenants
 * Crear nuevo cliente (solo admin)
 */
router.post('/', authenticate, requireRole(['admin']), tenantsController.createTenant);

/**
 * PUT /api/tenants/:id
 * Actualizar cliente (solo admin o el mismo cliente)
 */
router.put('/:id', authenticate, tenantsController.updateTenant);

export default router;
