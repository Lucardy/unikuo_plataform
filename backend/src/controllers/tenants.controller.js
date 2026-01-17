import Cliente from '../models/Cliente.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllTenants = asyncHandler(async (req, res) => {
    const { incluir_inactivos } = req.query;
    const clientes = await Cliente.findAll(incluir_inactivos === 'true');

    res.json({
        success: true,
        data: {
            clientes,
        },
    });
});

export const getMyTenant = asyncHandler(async (req, res) => {
    const clienteId = req.usuario?.cliente_id || null;

    if (!clienteId) {
        // Si el usuario es admin, puede no tener cliente (es normal)
        const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];
        if (rolesUsuario.includes('admin')) {
            return res.json({
                success: true,
                data: {
                    cliente: null,
                    message: 'Usuario administrador - sin cliente asignado',
                },
            });
        }

        return res.status(404).json({
            success: false,
            message: 'No tienes un cliente asignado',
        });
    }

    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
        return res.status(404).json({
            success: false,
            message: 'Cliente no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            cliente,
        },
    });
});

export const getTenantById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];
    const clienteIdUsuario = req.usuario?.cliente_id || null;

    // Solo admin puede ver cualquier cliente, otros solo el suyo
    if (!rolesUsuario.includes('admin') && clienteIdUsuario !== id) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para ver este cliente',
        });
    }

    const cliente = await Cliente.findById(id);

    if (!cliente) {
        return res.status(404).json({
            success: false,
            message: 'Cliente no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            cliente,
        },
    });
});

export const createTenant = asyncHandler(async (req, res) => {
    const { nombre, slug, email, telefono, dominio, usuario_dueño_id, activo } = req.body;

    if (!nombre || !slug) {
        return res.status(400).json({
            success: false,
            message: 'Nombre y slug son requeridos',
        });
    }

    // Verificar si el slug ya existe
    const slugExiste = await Cliente.slugExists(slug);
    if (slugExiste) {
        return res.status(409).json({
            success: false,
            message: 'El slug ya está en uso',
        });
    }

    const cliente = await Cliente.create({
        nombre,
        slug,
        email,
        telefono,
        dominio,
        usuario_dueño_id,
        activo,
    });

    res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: {
            cliente,
        },
    });
});

export const updateTenant = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];
    const clienteIdUsuario = req.usuario?.cliente_id || null;

    // Solo admin puede actualizar cualquier cliente, otros solo el suyo
    if (!rolesUsuario.includes('admin') && clienteIdUsuario !== id) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para actualizar este cliente',
        });
    }

    // Verificar slug si se está actualizando
    if (req.body.slug) {
        const slugExiste = await Cliente.slugExists(req.body.slug, id);
        if (slugExiste) {
            return res.status(409).json({
                success: false,
                message: 'El slug ya está en uso',
            });
        }
    }

    const cliente = await Cliente.update(id, req.body);

    if (!cliente) {
        return res.status(404).json({
            success: false,
            message: 'Cliente no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: {
            cliente,
        },
    });
});
