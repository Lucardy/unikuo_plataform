import db from '../config/knex.js';

/**
 * Modelo de Caja/Turno (Refactorizado con Knex)
 */
class TurnoCaja {
  /**
   * Abrir un nuevo turno de caja
   */
  async abrirTurno(datosTurno) {
    const { usuario_id, cliente_id, monto_inicial = 0 } = datosTurno;

    // Validar que el usuario no tenga un turno abierto
    const turnoAbierto = await this.obtenerTurnoAbiertoPorUsuario(usuario_id);
    if (turnoAbierto) {
      throw new Error('El usuario ya tiene un turno abierto');
    }

    try {
      const [turno] = await db('turnos_caja')
        .insert({
          usuario_id,
          cliente_id,
          monto_inicial,
          estado: 'open'
        })
        .returning('*');

      return turno;
    } catch (error) {
      console.error('Error al abrir turno:', error);
      throw error;
    }
  }

  /**
   * Cerrar un turno de caja
   */
  async cerrarTurno(turnoId, datosCierre) {
    const { efectivo_real, notas } = datosCierre;

    return await db.transaction(async (trx) => {
      // Obtener el turno
      const turno = await trx('turnos_caja')
        .where({ id: turnoId, estado: 'open' })
        .first();

      if (!turno) {
        throw new Error('Turno no encontrado o ya cerrado');
      }

      // Calcular totales del turno
      const resultadoTotales = await trx.raw('SELECT * FROM calcular_totales_turno(?)', [turnoId]);
      const totales = resultadoTotales.rows[0];

      // Calcular efectivo esperado
      const efectivoEsperado = parseFloat(turno.monto_inicial) + parseFloat(totales.total_efectivo || 0);
      const diferencia = parseFloat(efectivo_real) - efectivoEsperado;

      // Actualizar turno
      const [turnoCerrado] = await trx('turnos_caja')
        .where('id', turnoId)
        .update({
          fecha_cierre: trx.fn.now(),
          efectivo_esperado: efectivoEsperado,
          efectivo_real: efectivo_real,
          diferencia: diferencia,
          total_ventas: totales.total_ventas,
          total_efectivo: totales.total_efectivo,
          total_transferencia: totales.total_transferencia,
          total_tarjeta: totales.total_tarjeta,
          cantidad_ventas: totales.cantidad_ventas,
          estado: 'closed',
          notas: notas || null,
          actualizado_en: trx.fn.now()
        })
        .returning('*');

      return turnoCerrado;
    });
  }

  /**
   * Obtener turno abierto de un usuario
   */
  async obtenerTurnoAbiertoPorUsuario(usuarioId) {
    return await db('turnos_caja as tc')
      .innerJoin('usuarios as u', 'tc.usuario_id', 'u.id')
      .select([
        'tc.*',
        'u.email as email_usuario',
        'u.nombre as nombre_usuario',
        'u.apellido as apellido_usuario'
      ])
      .where('tc.usuario_id', usuarioId)
      .where('tc.estado', 'open')
      .orderBy('tc.fecha_apertura', 'desc')
      .first();
  }

  /**
   * Obtener turno por ID
   */
  async obtenerPorId(id) {
    return await db('turnos_caja as tc')
      .innerJoin('usuarios as u', 'tc.usuario_id', 'u.id')
      .select([
        'tc.*',
        'u.email as email_usuario',
        'u.nombre as nombre_usuario',
        'u.apellido as apellido_usuario'
      ])
      .where('tc.id', id)
      .first();
  }

  /**
   * Listar turnos con filtros
   */
  async obtenerTodos(filtros = {}) {
    const { usuario_id, estado, cliente_id, fecha_inicio, fecha_fin, limite = 50, offset = 0 } = filtros;

    const query = db('turnos_caja as tc')
      .innerJoin('usuarios as u', 'tc.usuario_id', 'u.id')
      .select([
        'tc.*',
        'u.email as email_usuario',
        'u.nombre as nombre_usuario',
        'u.apellido as apellido_usuario'
      ])
      .orderBy('tc.fecha_apertura', 'desc');

    if (usuario_id) {
      query.where('tc.usuario_id', usuario_id);
    }

    if (estado) {
      query.where('tc.estado', estado);
    }

    if (cliente_id) {
      query.where('tc.cliente_id', cliente_id);
    }

    if (fecha_inicio) {
      query.where('tc.fecha_apertura', '>=', fecha_inicio);
    }

    if (fecha_fin) {
      query.where('tc.fecha_apertura', '<=', fecha_fin);
    }

    if (limite) {
      query.limit(limite);
    }

    if (offset) {
      query.offset(offset);
    }

    return await query;
  }

  /**
   * Obtener resumen completo de un turno (con ventas)
   */
  async obtenerResumenTurno(turnoId) {
    const turno = await this.obtenerPorId(turnoId);
    if (!turno) return null;

    // Si el turno está abierto, calcular totales en tiempo real
    if (turno.estado === 'open') {
      const resultadoTotales = await db.raw('SELECT * FROM calcular_totales_turno(?)', [turnoId]);
      const totales = resultadoTotales.rows[0];

      turno.total_ventas = totales.total_ventas;
      turno.total_efectivo = totales.total_efectivo;
      turno.total_transferencia = totales.total_transferencia;
      turno.total_tarjeta = totales.total_tarjeta;
      turno.cantidad_ventas = totales.cantidad_ventas;
      turno.efectivo_esperado = parseFloat(turno.monto_inicial) + parseFloat(totales.total_efectivo);
    }

    // Obtener ventas del turno
    const ventas = await db('ventas as v')
      .innerJoin('usuarios as u', 'v.usuario_id', 'u.id')
      .select([
        'v.*',
        'u.email as email_usuario',
        'u.nombre as nombre_usuario',
        'u.apellido as apellido_usuario'
      ])
      .where('v.turno_id', turnoId)
      .orderBy('v.fecha_venta', 'desc');

    turno.ventas = ventas;

    return turno;
  }

  /**
   * Calcular totales de un turno
   */
  async calcularTotales(turnoId) {
    const resultado = await db.raw('SELECT * FROM calcular_totales_turno(?)', [turnoId]);
    return resultado.rows[0];
  }

  /**
   * Contar turnos
   */
  async contar(filtros = {}) {
    const { usuario_id, estado, cliente_id, fecha_inicio, fecha_fin } = filtros;

    const query = db('turnos_caja').count('* as total');

    if (usuario_id) {
      query.where('usuario_id', usuario_id);
    }

    if (estado) {
      query.where('estado', estado);
    }

    if (cliente_id) {
      query.where('cliente_id', cliente_id);
    }

    if (fecha_inicio) {
      query.where('fecha_apertura', '>=', fecha_inicio);
    }

    if (fecha_fin) {
      query.where('fecha_apertura', '<=', fecha_fin);
    }

    const resultado = await query.first();
    return parseInt(resultado.total);
  }
}

export default new TurnoCaja();
