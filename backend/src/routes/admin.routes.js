import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { verificarSuperAdmin } from '../middleware/verificarSuperAdmin.js';
import {
    obtenerClientes,
    obtenerClientePorId,
    actualizarConfigCliente
} from '../controllers/admin.controller.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol Super Admin
router.use(authenticate);
router.use(verificarSuperAdmin);

// Gestión de Clientes (Tenants)
router.get('/clientes', obtenerClientes);
router.get('/clientes/:id', obtenerClientePorId);
router.put('/clientes/:id/config', actualizarConfigCliente);

export default router;
