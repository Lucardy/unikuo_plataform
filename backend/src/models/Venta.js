import db from '../config/knex.js';
import { SALE_DETAILS_FIELDS, SALE_ITEMS_SUBQUERY } from './queries/sale.queries.js';

/**
 * Modelo de Venta (Refactorizado con Knex)
 */
class Venta {
  /**
   * Generar número de factura único
   */
  async generarNumeroFactura() {
    const resultado = await db.raw('SELECT generar_numero_factura() as numero_factura');
    return resultado.rows[0].numero_factura;
  }

  /**
   * Obtener todas las ventas
   */
  async obtenerTodas(filtros = {}) {
    const { estado, usuario_id, fecha_inicio, fecha_fin, limite = 50, offset = 0, cliente_id } = filtros;

    // We construct the "items" subquery manually or reuse the one from file if it is just a string fragment column
    // The BASE_SALE_QUERY imported has the whole SELECT FROM ... WHERE struct.
    // It's cleaner to rebuild the query using Knex and just inject the complex SELECT columns.
    // Looking at queries/sale.queries.js:
    // BASE_SALE_QUERY has a slightly different items subquery than SALE_ITEMS_SUBQUERY (includes less fields? or just code duplication? seems 'codigo_producto' is missing in BASE_SALE_QUERY's json_build_object)
    // I will use SALE_ITEMS_SUBQUERY to be consistent and richer.

    const query = db('ventas as v')
      .join('usuarios as u', 'v.usuario_id', 'u.id')
      .select(db.raw(`${SALE_DETAILS_FIELDS}, ${SALE_ITEMS_SUBQUERY}`));

    if (estado) {
      query.where('v.estado', estado);
    }

    if (usuario_id) {
      query.where('v.usuario_id', usuario_id);
    }

    if (fecha_inicio) {
      query.where('v.fecha_venta', '>=', fecha_inicio);
    }

    if (fecha_fin) {
      query.where('v.fecha_venta', '<=', fecha_fin);
    }

    if (cliente_id) {
      query.where('v.cliente_id', cliente_id);
    }

    query.orderBy('v.fecha_venta', 'desc');

    if (limite) {
      query.limit(limite);
    }

    if (offset) {
      query.offset(offset);
    }

    return await query;
  }

  /**
   * Obtener venta por ID
   */
  async obtenerPorId(id) {
    const venta = await db('ventas as v')
      .join('usuarios as u', 'v.usuario_id', 'u.id')
      .select(db.raw(`${SALE_DETAILS_FIELDS}, ${SALE_ITEMS_SUBQUERY}`))
      .where('v.id', id)
      .first();

    return venta || null;
  }

  /**
   * Crear nueva venta
   */
  async crear(datosVenta) {
    const {
      usuario_id,
      cliente_final_id,
      nombre_cliente,
      documento_cliente,
      metodo_pago = 'cash',
      codigo_descuento,
      estado = 'completed',
      notas,
      items,
      cliente_id,
    } = datosVenta;

    if (!cliente_id) {
      throw new Error('cliente_id es requerido para crear una venta');
    }

    return await db.transaction(async (trx) => {
      // Obtener turno abierto del usuario (si existe)
      const turno = await trx('turnos_caja')
        .where('usuario_id', usuario_id)
        .where('estado', 'open')
        .orderBy('fecha_apertura', 'desc')
        .first();

      const turno_id = turno?.id || null;

      // Generar número de factura
      const { rows } = await trx.raw('SELECT generar_numero_factura() as numero_factura');
      const numeroFactura = rows[0].numero_factura;

      // Calcular totales
      let subtotal = 0;
      let totalDescuento = 0;

      for (const item of items) {
        const itemSubtotal = (item.precio_unitario * item.cantidad) - (item.descuento || 0);
        subtotal += itemSubtotal;
        totalDescuento += item.descuento || 0;
      }

      const total = subtotal - totalDescuento;

      // Insertar venta
      const [venta] = await trx('ventas')
        .insert({
          numero_factura: numeroFactura,
          total,
          subtotal,
          total_descuento: totalDescuento,
          usuario_id,
          cliente_final_id: cliente_final_id || null,
          nombre_cliente: nombre_cliente || null,
          documento_cliente: documento_cliente || null,
          metodo_pago,
          codigo_descuento: codigo_descuento || null,
          estado,
          notas: notas || null,
          cliente_id,
          turno_id
        })
        .returning('*'); // Using * simplifies getting all fields to pass next

      // Insertar items
      const itemsData = items.map(item => ({
        venta_id: venta.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: (item.precio_unitario * item.cantidad) - (item.descuento || 0),
        descuento: item.descuento || 0
      }));

      if (itemsData.length > 0) {
        await trx('venta_items').insert(itemsData);
      }

      // Return full object by querying it back with joins/subqueries
      // We can reuse obtenerPorId but we need to pass the trx
      // Since obtenerPorId uses db, we can bind it or replicate query.
      // Easiest is to replicate query logic with trx

      const ventaCompleta = await trx('ventas as v')
        .join('usuarios as u', 'v.usuario_id', 'u.id')
        .select(trx.raw(`${SALE_DETAILS_FIELDS}, ${SALE_ITEMS_SUBQUERY}`))
        .where('v.id', venta.id)
        .first();

      return ventaCompleta;
    });
  }

  /**
   * Actualizar estado de venta
   */
  async actualizarEstado(id, estado) {
    const [resultado] = await db('ventas')
      .where('id', id)
      .update({
        estado,
        actualizado_en: db.fn.now()
      })
      .returning(['id', 'estado']);

    return resultado || null;
  }

  /**
   * Cancelar venta
   */
  async cancelar(id) {
    return await this.actualizarEstado(id, 'cancelled');
  }

  /**
   * Contar ventas
   */
  async contar(filtros = {}) {
    const { estado, usuario_id, fecha_inicio, fecha_fin, cliente_id } = filtros;

    const query = db('ventas').count('* as total');

    if (estado) {
      query.where('estado', estado);
    }

    if (usuario_id) {
      query.where('usuario_id', usuario_id);
    }

    if (fecha_inicio) {
      query.where('fecha_venta', '>=', fecha_inicio);
    }

    if (fecha_fin) {
      query.where('fecha_venta', '<=', fecha_fin);
    }

    if (cliente_id) {
      query.where('cliente_id', cliente_id);
    }

    const resultado = await query.first();
    return parseInt(resultado.total);
  }
}

export default new Venta();
