import db from '../config/knex.js';

class Banner {
  /**
    * Obtener todos los banners
    * @param {boolean} incluirInactivos - Incluir banners inactivos
    * @param {string|null} clienteId - ID del cliente (null para admins)
    * @returns {Promise<Array>}
    */
  static async obtenerTodos(incluirInactivos = false, clienteId = null) {
    const query = db('banners')
      .select([
        'id',
        'cliente_id',
        'titulo',
        'subtitulo',
        'url_imagen',
        'url_enlace',
        'orden',
        'activo',
        'creado_en',
        'actualizado_en'
      ])
      .orderBy([
        { column: 'orden', order: 'asc' },
        { column: 'creado_en', order: 'asc' }
      ]);

    // Filtrar por cliente_id si se proporciona
    if (clienteId !== null) {
      query.where('cliente_id', clienteId);
    }

    // Filtrar por activos si no se incluyen inactivos
    if (!incluirInactivos) {
      query.where('activo', true);
    }

    try {
      return await query;
    } catch (error) {
      console.error('Error al obtener banners:', error);
      throw error;
    }
  }

  /**
    * Obtener banner por ID
    * @param {string} id - ID del banner
    * @param {string|null} clienteId - ID del cliente (null para admins)
    * @returns {Promise<Object|null>}
    */
  static async obtenerPorId(id, clienteId = null) {
    const query = db('banners')
      .select([
        'id',
        'cliente_id',
        'titulo',
        'subtitulo',
        'url_imagen',
        'url_enlace',
        'orden',
        'activo',
        'creado_en',
        'actualizado_en'
      ])
      .where('id', id);

    // Filtrar por cliente_id si se proporciona
    if (clienteId !== null) {
      query.where('cliente_id', clienteId);
    }

    try {
      return await query.first() || null;
    } catch (error) {
      console.error('Error al obtener banner:', error);
      throw error;
    }
  }

  /**
    * Crear un nuevo banner
    * @param {Object} datosBanner - Datos del banner
    * @param {string|null} clienteId - ID del cliente (null para admins)
    * @returns {Promise<Object>}
    */
  static async crear(datosBanner, clienteId = null) {
    const {
      titulo = null,
      subtitulo = null,
      url_imagen,
      url_enlace = null,
      orden = 0,
      activo = true,
    } = datosBanner;

    if (!url_imagen) {
      throw new Error('La imagen es requerida para crear un banner');
    }

    try {
      const [banner] = await db('banners')
        .insert({
          cliente_id: clienteId,
          titulo,
          subtitulo,
          url_imagen,
          url_enlace,
          orden,
          activo
        })
        .returning('*');

      return banner;
    } catch (error) {
      console.error('Error al crear banner:', error);
      throw error;
    }
  }

  /**
    * Actualizar un banner
    * @param {string} id - ID del banner
    * @param {Object} datosBanner - Datos a actualizar
    * @param {string|null} clienteId - ID del cliente (null para admins)
    * @returns {Promise<Object|null>}
    */
  static async actualizar(id, datosBanner, clienteId = null) {
    const {
      titulo,
      subtitulo,
      url_imagen,
      url_enlace,
      orden,
      activo,
    } = datosBanner;

    const updateData = {};

    if (titulo !== undefined) updateData.titulo = titulo;
    if (subtitulo !== undefined) updateData.subtitulo = subtitulo;
    if (url_imagen !== undefined) updateData.url_imagen = url_imagen;
    if (url_enlace !== undefined) updateData.url_enlace = url_enlace;
    if (orden !== undefined) updateData.orden = orden;
    if (activo !== undefined) updateData.activo = activo;

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id, clienteId);
    }

    updateData.actualizado_en = db.fn.now();

    try {
      const query = db('banners')
        .where('id', id)
        .update(updateData)
        .returning('*');

      // Filtrar por cliente_id si se proporciona
      if (clienteId !== null) {
        query.where('cliente_id', clienteId);
      }

      const [banner] = await query;
      return banner || null;
    } catch (error) {
      console.error('Error al actualizar banner:', error);
      throw error;
    }
  }

  /**
    * Eliminar un banner
    * @param {string} id - ID del banner
    * @param {string|null} clienteId - ID del cliente (null para admins)
    * @returns {Promise<boolean>}
    */
  static async eliminar(id, clienteId = null) {
    try {
      const query = db('banners').where('id', id);

      // Filtrar por cliente_id si se proporciona
      if (clienteId !== null) {
        query.where('cliente_id', clienteId);
      }

      const rowsDeleted = await query.del();
      return rowsDeleted > 0;
    } catch (error) {
      console.error('Error al eliminar banner:', error);
      throw error;
    }
  }
}

export default Banner;
