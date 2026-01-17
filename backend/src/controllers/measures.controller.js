import TipoMedida from '../models/TipoMedida.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllMeasureTypes = asyncHandler(async (req, res) => {
    const { incluir_inactivos } = req.query;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todos los tipos de medida (clienteId = null)
    // Si no es admin, solo ve los de su cliente
    const tiposMedida = await TipoMedida.obtenerTodos(
        incluir_inactivos === 'true',
        rolesUsuario.includes('admin') ? null : clienteId
    );

    res.json({
        success: true,
        data: {
            tiposMedida,
        },
    });
});

export const getMeasureTypeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tipoMedida = await TipoMedida.obtenerPorId(id);

    if (!tipoMedida) {
        return res.status(404).json({
            success: false,
            message: 'Tipo de medida no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            tipoMedida,
        },
    });
});

export const createMeasureType = asyncHandler(async (req, res) => {
    const { nombre, descripcion, unidad, activo } = req.body;

    if (!nombre) {
        return res.status(400).json({
            success: false,
            message: 'El nombre es requerido',
        });
    }

    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Permitir que admins creen tipos de medida sin cliente_id
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    if (!clienteIdFinal && !rolesUsuario.includes('admin')) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente asignado',
        });
    }

    const tipoMedida = await TipoMedida.crear({
        nombre,
        descripcion,
        unidad,
        activo,
        cliente_id: clienteIdFinal,
    });

    res.status(201).json({
        success: true,
        message: 'Tipo de medida creado exitosamente',
        data: {
            tipoMedida,
        },
    });
});

export const updateMeasureType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el tipo de medida existe y pertenece al cliente (o es admin)
    const tipoMedidaExistente = await TipoMedida.obtenerPorId(id);
    if (!tipoMedidaExistente) {
        return res.status(404).json({
            success: false,
            message: 'Tipo de medida no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && tipoMedidaExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para actualizar este tipo de medida',
        });
    }

    const tipoMedida = await TipoMedida.actualizar(id, req.body);

    if (!tipoMedida) {
        return res.status(404).json({
            success: false,
            message: 'Tipo de medida no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Tipo de medida actualizado exitosamente',
        data: {
            tipoMedida,
        },
    });
});

export const deleteMeasureType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Verificar que el tipo de medida existe y pertenece al cliente (o es admin)
    const tipoMedidaExistente = await TipoMedida.obtenerPorId(id);
    if (!tipoMedidaExistente) {
        return res.status(404).json({
            success: false,
            message: 'Tipo de medida no encontrado',
        });
    }

    // Verificar permisos (solo si no es admin)
    if (!rolesUsuario.includes('admin') && tipoMedidaExistente.cliente_id !== clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para eliminar este tipo de medida',
        });
    }

    const tipoMedida = await TipoMedida.eliminar(id);

    if (!tipoMedida) {
        return res.status(404).json({
            success: false,
            message: 'Tipo de medida no encontrado',
        });
    }

    res.json({
        success: true,
        message: 'Tipo de medida eliminado exitosamente',
        data: {
            tipoMedida,
        },
    });
});
