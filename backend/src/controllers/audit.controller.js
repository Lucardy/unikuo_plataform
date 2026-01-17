import RegistroAuditoria from '../models/RegistroAuditoria.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAuditLogs = asyncHandler(async (req, res) => {
    const {
        usuario_id,
        accion,
        nombre_tabla,
        fecha_desde,
        fecha_hasta,
        limite = 100,
        offset = 0,
    } = req.query;

    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todos los logs (clienteId = null)
    // Si no es admin, solo ve los de su cliente
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    const registros = await RegistroAuditoria.obtenerTodos({
        cliente_id: clienteIdFinal,
        usuario_id: usuario_id || null,
        accion: accion || null,
        nombre_tabla: nombre_tabla || null,
        fecha_desde: fecha_desde || null,
        fecha_hasta: fecha_hasta || null,
        limite: parseInt(limite),
        offset: parseInt(offset),
    });

    res.json({
        success: true,
        data: {
            registros,
        },
    });
});

export const getAuditStatistics = asyncHandler(async (req, res) => {
    const { fecha_desde, fecha_hasta } = req.query;
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];

    // Si es admin, puede ver todas las estadísticas (clienteId = null)
    const clienteIdFinal = rolesUsuario.includes('admin') ? null : clienteId;

    const estadisticas = await RegistroAuditoria.obtenerEstadisticas(
        clienteIdFinal,
        fecha_desde || null,
        fecha_hasta || null
    );

    res.json({
        success: true,
        data: {
            estadisticas,
        },
    });
});

export const getAuditLogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const registro = await RegistroAuditoria.obtenerPorId(id);

    if (!registro) {
        return res.status(404).json({
            success: false,
            message: 'Registro de auditoría no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            registro,
        },
    });
});
