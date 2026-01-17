import db from '../config/knex.js';

/**
 * Modelo de Tipo de Talle (Refactorizado con Knex)
 */
class TipoTalle {
  /**
    * Obtener todos los tipos de talle
    */
  async obtenerTodos(incluirInactivos = false, clienteId = null) {
    const query = db('tipos_talle as st')
      .select([
        'st.id',
        'st.nombre',
        'st.descripcion',
        'st.activo',
        'st.creado_en',
        'st.actualizado_en',
        db.raw('(SELECT COUNT(*) FROM talles s WHERE s.tipo_talle_id = st.id) as cantidad_talles')
      ])
      .orderBy('st.nombre');

    // Filtrar por cliente_id si se proporciona
    if (clienteId !== null) {
      query.where('st.cliente_id', clienteId);
    }

    if (!incluirInactivos) {
      query.where('st.activo', true);
    }

    try {
      return await query;
    } catch (error) {
      console.error('Error al obtener tipos de talle:', error);
      throw error;
    }
  }

  /**
    * Obtener tipo de talle por ID
    */
  async obtenerPorId(id) {
    try {
      return await db('tipos_talle as st')
        .select([
          'st.id',
          'st.nombre',
          'st.descripcion',
          'st.activo',
          'st.cliente_id',
          'st.creado_en',
          'st.actualizado_en',
          db.raw(`
            (
              SELECT json_agg(
                json_build_object(
                  'id', s.id,
                  'nombre', s.nombre,
                  'orden', s.orden
                ) ORDER BY s.orden
              )
              FROM talles s
              WHERE s.tipo_talle_id = st.id
            ) as talles
          `)
        ])
        .where('st.id', id)
        .first();
    } catch (error) {
      console.error('Error al obtener tipo de talle:', error);
      throw error;
    }
  }

  /**
    * Crear nuevo tipo de talle
    */
  async crear(datosTipoTalle) {
    const { nombre, descripcion, activo = true, cliente_id } = datosTipoTalle;

    try {
      const [tipoTalle] = await db('tipos_talle')
        .insert({
          nombre,
          descripcion: descripcion || null,
          activo,
          cliente_id: cliente_id || null
        })
        .returning(['id', 'nombre', 'descripcion', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

      return tipoTalle;
    } catch (error) {
      console.error('Error al crear tipo de talle:', error);
      throw error;
    }
  }

  /**
    * Actualizar tipo de talle
    */
  async actualizar(id, datosTipoTalle) {
    const updateData = {};

    if (datosTipoTalle.nombre !== undefined) updateData.nombre = datosTipoTalle.nombre;
    if (datosTipoTalle.descripcion !== undefined) updateData.descripcion = datosTipoTalle.descripcion;
    if (datosTipoTalle.activo !== undefined) updateData.activo = datosTipoTalle.activo;

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    try {
      const [tipoTalle] = await db('tipos_talle')
        .where('id', id)
        .update(updateData)
        .returning(['id', 'nombre', 'descripcion', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

      return tipoTalle || null;
    } catch (error) {
      console.error('Error al actualizar tipo de talle:', error);
      throw error;
    }
  }

  /**
    * Eliminar tipo de talle (soft delete)
    */
  async eliminar(id) {
    try {
      const [tipoTalle] = await db('tipos_talle')
        .where('id', id)
        .update({
          activo: false,
          actualizado_en: db.fn.now()
        })
        .returning('id');

      return tipoTalle || null;
    } catch (error) {
      console.error('Error al eliminar tipo de talle:', error);
      throw error;
    }
  }
}

export default new TipoTalle();
