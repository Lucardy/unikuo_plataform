import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as auditController from '../controllers/audit.controller.js';

const router = express.Router();

/**
 * GET /api/audit
 * Obtener todos los registros de auditoría (requiere autenticación y rol admin)
 */
router.get('/', authenticate, requireRole(['admin', 'store_owner', 'super_admin']), auditController.getAuditLogs);

/**
 * GET /api/audit/statistics
 * Obtener estadísticas de auditoría (requiere autenticación y rol admin)
 */
router.get('/statistics', authenticate, requireRole(['admin', 'store_owner', 'super_admin']), auditController.getAuditStatistics);

/**
 * GET /api/audit/:id
 * Obtener registro de auditoría por ID (requiere autenticación y rol admin)
 */
router.get('/:id', authenticate, requireRole(['admin', 'store_owner', 'super_admin']), auditController.getAuditLogById);

export default router;
