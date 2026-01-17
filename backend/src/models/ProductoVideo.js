import db from '../config/knex.js';

/**
 * Modelo de Video de Producto (Refactorizado con Knex)
 */
class ProductoVideo {
  /**
   * Obtener todos los videos de un producto
   */
  async obtenerPorProductoId(productoId, clienteId = null) {
    const query = db('producto_videos')
      .where('producto_id', productoId)
      .andWhere('activo', true);

    if (clienteId) {
      query.andWhere('cliente_id', clienteId);
    }

    query.orderBy('orden').orderBy('creado_en');

    return await query;
  }

  /**
   * Obtener video por ID
   */
  async obtenerPorId(id) {
    const video = await db('producto_videos')
      .where('id', id)
      .first();

    return video || null;
  }

  /**
   * Crear nuevo video
   */
  async crear(datosVideo) {
    const {
      producto_id,
      url,
      tipo_video = 'youtube',
      titulo,
      descripcion,
      es_principal = false,
      orden = 0,
      activo = true,
      cliente_id,
    } = datosVideo;

    return await db.transaction(async (trx) => {
      // Si este video es principal, desmarcar otros como principales
      if (es_principal) {
        await trx('producto_videos')
          .where('producto_id', producto_id)
          .update({ es_principal: false });
      }

      const [nuevoVideo] = await trx('producto_videos')
        .insert({
          producto_id,
          url,
          tipo_video,
          titulo: titulo || null,
          descripcion: descripcion || null,
          es_principal,
          orden,
          activo,
          cliente_id: cliente_id || null
        })
        .returning([
          'id', 'producto_id', 'url', 'tipo_video', 'titulo', 'descripcion',
          'es_principal', 'orden', 'activo', 'cliente_id', 'creado_en', 'actualizado_en'
        ]);

      return nuevoVideo;
    });
  }

  /**
   * Actualizar video
   */
  async actualizar(id, datosVideo) {
    return await db.transaction(async (trx) => {
      // Si se marca como principal, desmarcar otros
      if (datosVideo.es_principal) {
        let pId = datosVideo.producto_id;

        // Buscamos el producto_id si no viene
        if (!pId) {
          const v = await trx('producto_videos').where('id', id).select('producto_id').first();
          if (v) pId = v.producto_id;
        }

        if (pId) {
          await trx('producto_videos')
            .where('producto_id', pId)
            .whereNot('id', id)
            .update({ es_principal: false });
        }
      }

      const mapeoCampos = {
        url: 'url',
        tipo_video: 'tipo_video',
        titulo: 'titulo',
        descripcion: 'descripcion',
        es_principal: 'es_principal',
        orden: 'orden',
        activo: 'activo',
      };

      const updateData = {};
      for (const campo in mapeoCampos) {
        if (datosVideo[campo] !== undefined) {
          updateData[campo] = datosVideo[campo];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return await this.obtenerPorId(id);
      }

      updateData.actualizado_en = db.fn.now();

      const [videoActualizado] = await trx('producto_videos')
        .where('id', id)
        .update(updateData)
        .returning([
          'id', 'producto_id', 'url', 'tipo_video', 'titulo', 'descripcion',
          'es_principal', 'orden', 'activo', 'creado_en', 'actualizado_en'
        ]);

      return videoActualizado || null;
    });
  }

  /**
   * Eliminar video
   */
  async eliminar(id) {
    const [resultado] = await db('producto_videos')
      .where('id', id)
      .del()
      .returning(['id', 'url']);

    return resultado || null;
  }
}

export default new ProductoVideo();
