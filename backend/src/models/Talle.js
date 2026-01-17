import db from '../config/knex.js';

/**
 * Modelo de Talle (Refactorizado con Knex)
 */
class Talle {
  /**
   * Obtener todos los talles
   */
  async obtenerTodos(tipoTalleId = null, clienteId = null) {
    const query = db('talles as s')
      .join('tipos_talle as st', 's.tipo_talle_id', 'st.id')
      .select([
        's.id',
        's.tipo_talle_id',
        's.nombre',
        's.orden',
        's.creado_en',
        's.actualizado_en',
        'st.nombre as nombre_tipo_talle'
      ]);

    if (clienteId !== null) {
      query.where('s.cliente_id', clienteId);
    }

    if (tipoTalleId) {
      query.where('s.tipo_talle_id', tipoTalleId);
    }

    query.orderBy('s.orden').orderBy('s.nombre');

    return await query;
  }

  /**
   * Obtener talle por ID
   */
  async obtenerPorId(id) {
    const talle = await db('talles as s')
      .join('tipos_talle as st', 's.tipo_talle_id', 'st.id')
      .select([
        's.id',
        's.tipo_talle_id',
        's.nombre',
        's.orden',
        's.cliente_id',
        's.creado_en',
        's.actualizado_en',
        'st.nombre as nombre_tipo_talle'
      ])
      .where('s.id', id)
      .first();

    return talle || null;
  }

  /**
   * Crear nuevo talle
   */
  async crear(datosTalle) {
    const { tipo_talle_id, nombre, orden = 0, cliente_id } = datosTalle;

    const [nuevoTalle] = await db('talles')
      .insert({
        tipo_talle_id,
        nombre,
        orden,
        cliente_id: cliente_id || null
      })
      .returning([
        'id', 'tipo_talle_id', 'nombre', 'orden', 'cliente_id', 'creado_en', 'actualizado_en'
      ]);

    return nuevoTalle;
  }

  /**
   * Actualizar talle
   */
  async actualizar(id, datosTalle) {
    const updateData = {};
    if (datosTalle.nombre !== undefined) updateData.nombre = datosTalle.nombre;
    if (datosTalle.orden !== undefined) updateData.orden = datosTalle.orden;

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    const [talleActualizado] = await db('talles')
      .where('id', id)
      .update(updateData)
      .returning([
        'id', 'tipo_talle_id', 'nombre', 'orden', 'creado_en', 'actualizado_en'
      ]);

    return talleActualizado || null;
  }

  /**
   * Eliminar talle
   */
  async eliminar(id) {
    const [resultado] = await db('talles')
      .where('id', id)
      .del()
      .returning('id');

    return resultado || null;
  }

  /**
   * Asociar talle a producto
   */
  async asociarAProducto(productoId, talleId) {
    const [resultado] = await db('producto_talles')
      .insert({
        producto_id: productoId,
        talle_id: talleId
      })
      .onConflict(['producto_id', 'talle_id'])
      .ignore()
      .returning('id');

    return resultado || null;
  }

  /**
   * Desasociar talle de producto
   */
  async desasociarDeProducto(productoId, talleId) {
    const [resultado] = await db('producto_talles')
      .where('producto_id', productoId)
      .where('talle_id', talleId)
      .del()
      .returning('id');

    return resultado || null;
  }

  /**
   * Obtener talles de un producto
   */
  async obtenerPorProductoId(productoId) {
    return await db('talles as s')
      .join('producto_talles as ps', 's.id', 'ps.talle_id')
      .join('tipos_talle as st', 's.tipo_talle_id', 'st.id')
      .select([
        's.id',
        's.tipo_talle_id',
        's.nombre',
        's.orden',
        'st.nombre as nombre_tipo_talle'
      ])
      .where('ps.producto_id', productoId)
      .orderBy('s.orden')
      .orderBy('s.nombre');
  }
}

export default new Talle();
