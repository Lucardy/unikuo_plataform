import ClienteFinal from '../models/ClienteFinal.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllCustomers = asyncHandler(async (req, res) => {
    const { incluir_inactivos, busqueda } = req.query;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todos los clientes (clienteId = null)
    // Si no es admin, solo ve los de su cliente
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    const clientes = await ClienteFinal.obtenerTodos(
        clienteIdFinal,
        incluir_inactivos === 'true',
        busqueda || ''
    );

    res.json({
        success: true,
        data: {
            clientes,
        },
    });
});

export const getCustomerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    const cliente = await ClienteFinal.obtenerPorId(id);

    if (!cliente) {
        return res.status(404).json({
            success: false,
            message: 'Cliente no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && cliente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para ver este cliente',
        });
    }

    res.json({
        success: true,
        data: {
            cliente,
        },
    });
});

export const createCustomer = asyncHandler(async (req, res) => {
    const {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        documento,
        fecha_nacimiento,
        notas,
        activo,
    } = req.body;

    if (!nombre || !apellido) {
        return res.status(400).json({
            success: false,
            message: 'El nombre y apellido son requeridos',
        });
    }

    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Permitir que admins creen clientes sin cliente_id
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    if (!clienteIdFinal && !rolesUsuario.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente asignado',
        });
    }

    const cliente = await ClienteFinal.crear({
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        documento,
        fecha_nacimiento,
        notas,
        activo: activo !== undefined ? activo : true,
        cliente_id: clienteIdFinal,
    });

    res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: {
            cliente,
        },
    });
});

export const updateCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el cliente existe y pertenece al cliente (o es admin)
    const clienteExistente = await ClienteFinal.obtenerPorId(id);
    if (!clienteExistente) {
        return res.status(404).json({
            success: false,
            message: 'Cliente no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && clienteExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para actualizar este cliente',
        });
    }

    const cliente = await ClienteFinal.actualizar(id, req.body);

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

export const deleteCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el cliente existe y pertenece al cliente (o es admin)
    const clienteExistente = await ClienteFinal.obtenerPorId(id);
    if (!clienteExistente) {
        return res.status(404).json({
            success: false,
            message: 'Cliente no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && clienteExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para eliminar este cliente',
        });
    }

    const cliente = await ClienteFinal.eliminar(id);

    if (!cliente) {
        return res.status(404).json({
            success: false,
            message: 'Cliente no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Cliente eliminado exitosamente',
    });
});
