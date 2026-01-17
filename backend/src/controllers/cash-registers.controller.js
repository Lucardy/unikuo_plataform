import TurnoCaja from '../models/TurnoCaja.js';
import asyncHandler from '../utils/asyncHandler.js';

export const openCashRegister = asyncHandler(async (req, res) => {
    const { monto_inicial } = req.body;

    if (monto_inicial === undefined || monto_inicial === null) {
        return res.status(400).json({
            success: false,
            message: 'El monto inicial es requerido',
        });
    }

    const montoInicialNum = parseFloat(monto_inicial);
    if (isNaN(montoInicialNum) || montoInicialNum < 0) {
        return res.status(400).json({
            success: false,
            message: 'El monto inicial debe ser un número no negativo',
        });
    }

    const clienteId = req.usuario?.cliente_id;
    if (!clienteId) {
        return res.status(403).json({
            success: false,
            message: 'No tienes un cliente (tienda) asignado',
        });
    }

    const turno = await TurnoCaja.abrirTurno({
        usuario_id: req.usuario.id,
        cliente_id: clienteId,
        monto_inicial: montoInicialNum,
    });

    res.status(201).json({
        success: true,
        message: 'Turno abierto exitosamente',
        data: {
            turno,
        },
    });
});

export const closeCashRegister = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { efectivo_real, notas } = req.body;

    if (efectivo_real === undefined || efectivo_real === null) {
        return res.status(400).json({
            success: false,
            message: 'El monto de efectivo real es requerido',
        });
    }

    const efectivoRealNum = parseFloat(efectivo_real);
    if (isNaN(efectivoRealNum) || efectivoRealNum < 0) {
        return res.status(400).json({
            success: false,
            message: 'El monto de efectivo real debe ser un número no negativo',
        });
    }

    await TurnoCaja.cerrarTurno(id, {
        efectivo_real: efectivoRealNum,
        notas,
    });

    const resumen = await TurnoCaja.obtenerResumenTurno(id);

    res.json({
        success: true,
        message: 'Turno cerrado exitosamente',
        data: {
            turno: resumen,
        },
    });
});

export const getCurrentCashRegister = asyncHandler(async (req, res) => {
    const usuarioId = req.usuario.id;
    const turno = await TurnoCaja.obtenerTurnoAbiertoPorUsuario(usuarioId);

    if (!turno) {
        return res.json({
            success: true,
            message: 'No hay turno abierto',
            data: {
                turno: null,
            },
        });
    }

    const totales = await TurnoCaja.calcularTotales(turno.id);
    const turnoConTotales = {
        ...turno,
        total_ventas: totales.total_ventas,
        total_efectivo: totales.total_efectivo,
        total_transferencia: totales.total_transferencia,
        total_tarjeta: totales.total_tarjeta,
        cantidad_ventas: totales.cantidad_ventas,
        efectivo_esperado: parseFloat(turno.monto_inicial) + parseFloat(totales.total_efectivo),
    };

    res.json({
        success: true,
        data: {
            turno: turnoConTotales,
        },
    });
});

export const getCashRegisterById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const turno = await TurnoCaja.obtenerPorId(id);

    if (!turno) {
        return res.status(404).json({
            success: false,
            message: 'Turno no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            turno,
        },
    });
});

export const getCashRegisterSummary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resumen = await TurnoCaja.obtenerResumenTurno(id);

    if (!resumen) {
        return res.status(404).json({
            success: false,
            message: 'Turno no encontrado',
        });
    }

    res.json({
        success: true,
        data: {
            turno: resumen,
        },
    });
});

export const getAllCashRegisters = asyncHandler(async (req, res) => {
    const {
        usuario_id,
        estado,
        fecha_inicio,
        fecha_fin,
        limite,
        offset,
    } = req.query;

    const filtros = {};
    if (usuario_id) filtros.usuario_id = usuario_id;
    if (estado) filtros.estado = estado;
    if (fecha_inicio) filtros.fecha_inicio = fecha_inicio;
    if (fecha_fin) filtros.fecha_fin = fecha_fin;
    if (limite) filtros.limite = parseInt(limite);
    if (offset) filtros.offset = parseInt(offset);

    const clienteId = req.usuario?.cliente_id || null;
    filtros.cliente_id = clienteId;

    const turnos = await TurnoCaja.obtenerTodos(filtros);
    const total = await TurnoCaja.contar(filtros);

    res.json({
        success: true,
        data: {
            turnos,
            total,
            limite: filtros.limite || null,
            offset: filtros.offset || null,
        },
    });
});
