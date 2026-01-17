import db from '../config/knex.js';

/**
 * Modelo de Imagen de Producto (Refactorizado con Knex)
 */
class ProductoImagen {
  /**
   * Obtener todas las imágenes de un producto
   */
  async obtenerPorProductoId(productoId) {
    return await db('producto_imagenes')
      .where('producto_id', productoId)
      .orderBy('orden')
      .orderBy('creado_en');
  }

  /**
   * Obtener imagen por ID
   */
  async obtenerPorId(id) {
    const imagen = await db('producto_imagenes')
      .where('id', id)
      .first();

    return imagen || null;
  }

  /**
   * Crear nueva imagen
   */
  async crear(datosImagen) {
    const { producto_id, nombre_archivo, ruta, es_principal = false, orden = 0 } = datosImagen;

    return await db.transaction(async (trx) => {
      // Si esta imagen es principal, desmarcar otras como principales
      if (es_principal) {
        await trx('producto_imagenes')
          .where('producto_id', producto_id)
          .update({ es_principal: false });
      }

      // Insertar nueva imagen
      const [nuevaImagen] = await trx('producto_imagenes')
        .insert({
          producto_id,
          nombre_archivo: nombre_archivo || null,
          ruta,
          es_principal,
          orden
        })
        .returning([
          'id', 'producto_id', 'nombre_archivo', 'ruta', 'es_principal', 'orden', 'creado_en', 'actualizado_en'
        ]);

      return nuevaImagen;
    });
  }

  /**
   * Actualizar imagen
   */
  async actualizar(id, datosImagen) {
    const { nombre_archivo, ruta, es_principal, orden, producto_id } = datosImagen;

    return await db.transaction(async (trx) => {
      // Si se marca como principal, desmarcar otras
      if (es_principal && producto_id) {
        await trx('producto_imagenes')
          .where('producto_id', producto_id)
          .whereNot('id', id)
          .update({ es_principal: false });
      }

      const updateData = {};
      if (nombre_archivo !== undefined) updateData.nombre_archivo = nombre_archivo;
      if (ruta !== undefined) updateData.ruta = ruta;
      if (es_principal !== undefined) updateData.es_principal = es_principal;
      if (orden !== undefined) updateData.orden = orden;

      if (Object.keys(updateData).length === 0) {
        return await this.obtenerPorId(id);
      }

      updateData.actualizado_en = db.fn.now();

      const [imagenActualizada] = await trx('producto_imagenes')
        .where('id', id)
        .update(updateData)
        .returning([
          'id', 'producto_id', 'nombre_archivo', 'ruta', 'es_principal', 'orden', 'creado_en', 'actualizado_en'
        ]);

      return imagenActualizada || null;
    });
  }

  /**
   * Eliminar imagen
   */
  async eliminar(id) {
    const [resultado] = await db('producto_imagenes')
      .where('id', id)
      .del()
      .returning(['id', 'ruta']);

    return resultado || null;
  }

  /**
   * Establecer imagen principal
   */
  async establecerPrincipal(imagenId, productoId) {
    return await db.transaction(async (trx) => {
      // Desmarcar todas las imágenes del producto
      await trx('producto_imagenes')
        .where('producto_id', productoId)
        .update({ es_principal: false });

      // Marcar la imagen seleccionada como principal
      const [resultado] = await trx('producto_imagenes')
        .where('id', imagenId)
        .where('producto_id', productoId)
        .update({
          es_principal: true,
          actualizado_en: db.fn.now()
        })
        .returning('id');

      return resultado || null;
    });
  }

  /**
   * Reordenar imágenes
   */
  async reordenar(productoId, ordenesImagenes) {
    // ordenesImagenes: [{ id, orden }]
    return await db.transaction(async (trx) => {
      for (const { id, orden } of ordenesImagenes) {
        await trx('producto_imagenes')
          .where('id', id)
          .where('producto_id', productoId)
          .update({
            orden,
            actualizado_en: db.fn.now()
          });
      }
      return true;
    });
  }
}

export default new ProductoImagen();
