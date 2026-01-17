import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as customersController from '../controllers/customers.controller.js';

const router = express.Router();

/**
 * GET /api/customers
 * Obtener todos los clientes (requiere autenticación)
 */
router.get('/', authenticate, customersController.getAllCustomers);

/**
 * GET /api/customers/:id
 * Obtener cliente por ID (requiere autenticación)
 */
router.get('/:id', authenticate, customersController.getCustomerById);

/**
 * POST /api/customers
 * Crear nuevo cliente (requiere autenticación)
 */
router.post('/', authenticate, customersController.createCustomer);

/**
 * PUT /api/customers/:id
 * Actualizar cliente (requiere autenticación)
 */
router.put('/:id', authenticate, customersController.updateCustomer);

/**
 * DELETE /api/customers/:id
 * Eliminar cliente (requiere autenticación - soft delete)
 */
router.delete('/:id', authenticate, customersController.deleteCustomer);

export default router;
