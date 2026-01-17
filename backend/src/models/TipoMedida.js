import db from '../config/knex.js';

/**
 * Modelo de Tipo de Medida (Refactorizado con Knex)
 */
class TipoMedida {
  /**
    * Obtener todos los tipos de medida
    */
  async obtenerTodos(incluirInactivos = false, clienteId = null) {
    const query = db('tipos_medida as mt')
      .select([
        'mt.id',
        'mt.nombre',
        'mt.descripcion',
        'mt.unidad',
        'mt.activo',
        'mt.creado_en',
        'mt.actualizado_en'
      ])
      .orderBy('mt.nombre');

    // Filtrar por cliente_id si se proporciona
    if (clienteId !== null) {
      query.where('mt.cliente_id', clienteId);
    }

    if (!incluirInactivos) {
      query.where('mt.activo', true);
    }

    try {
      return await query;
    } catch (error) {
      console.error('Error al obtener tipos de medida:', error);
      throw error;
    }
  }

  /**
    * Obtener tipo de medida por ID
    */
  async obtenerPorId(id) {
    try {
      return await db('tipos_medida as mt')
        .select([
          'mt.id',
          'mt.nombre',
          'mt.descripcion',
          'mt.unidad',
          'mt.activo',
          'mt.cliente_id',
          'mt.creado_en',
          'mt.actualizado_en'
        ])
        .where('mt.id', id)
        .first();
    } catch (error) {
      console.error('Error al obtener tipo de medida:', error);
      throw error;
    }
  }

  /**
    * Crear nuevo tipo de medida
    */
  async crear(datosTipoMedida) {
    const { nombre, descripcion, unidad, activo = true, cliente_id } = datosTipoMedida;

    try {
      const [tipoMedida] = await db('tipos_medida')
        .insert({
          nombre,
          descripcion: descripcion || null,
          unidad: unidad || null,
          activo,
          cliente_id: cliente_id || null
        })
        .returning(['id', 'nombre', 'descripcion', 'unidad', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

      return tipoMedida;
    } catch (error) {
      console.error('Error al crear tipo de medida:', error);
      throw error;
    }
  }

  /**
    * Actualizar tipo de medida
    */
  async actualizar(id, datosTipoMedida) {
    const updateData = {};

    if (datosTipoMedida.nombre !== undefined) updateData.nombre = datosTipoMedida.nombre;
    if (datosTipoMedida.descripcion !== undefined) updateData.descripcion = datosTipoMedida.descripcion;
    if (datosTipoMedida.unidad !== undefined) updateData.unidad = datosTipoMedida.unidad;
    if (datosTipoMedida.activo !== undefined) updateData.activo = datosTipoMedida.activo;

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    try {
      const [tipoMedida] = await db('tipos_medida')
        .where('id', id)
        .update(updateData)
        .returning(['id', 'nombre', 'descripcion', 'unidad', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

      return tipoMedida || null;
    } catch (error) {
      console.error('Error al actualizar tipo de medida:', error);
      throw error;
    }
  }

  /**
    * Eliminar tipo de medida (soft delete - desactivar)
    */
  async eliminar(id) {
    try {
      const [tipoMedida] = await db('tipos_medida')
        .where('id', id)
        .update({
          activo: false,
          actualizado_en: db.fn.now()
        })
        .returning(['id', 'nombre', 'descripcion', 'unidad', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

      return tipoMedida || null;
    } catch (error) {
      console.error('Error al eliminar tipo de medida:', error);
      throw error;
    }
  }
}

export default new TipoMedida();
