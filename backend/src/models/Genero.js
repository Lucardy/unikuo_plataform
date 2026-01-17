import db from '../config/knex.js';

/**
 * Modelo de Genero (Refactorizado con Knex)
 */
class Genero {
  /**
   * Obtener todos los géneros
   */
  async obtenerTodos(incluirInactivos = false, clienteId = null) {
    const query = db('generos')
      .select([
        'id',
        'nombre',
        'descripcion',
        'orden',
        'activo',
        'creado_en',
        'actualizado_en'
      ])
      .orderBy([
        { column: 'orden', order: 'asc' },
        { column: 'nombre', order: 'asc' }
      ]);

    // Filtrar por cliente_id si se proporciona
    if (clienteId !== null) {
      query.where('cliente_id', clienteId);
    }

    if (!incluirInactivos) {
      query.where('activo', true);
    }

    return await query;
  }

  /**
   * Obtener género por ID
   */
  async obtenerPorId(id) {
    return await db('generos')
      .select([
        'id',
        'nombre',
        'descripcion',
        'orden',
        'activo',
        'cliente_id',
        'creado_en',
        'actualizado_en'
      ])
      .where('id', id)
      .first();
  }

  /**
   * Crear nuevo género
   */
  async crear(datosGenero) {
    const { nombre, descripcion, orden = 0, activo = true, cliente_id } = datosGenero;

    const [genero] = await db('generos')
      .insert({
        nombre,
        descripcion: descripcion || null,
        orden,
        activo,
        cliente_id: cliente_id || null
      })
      .returning(['id', 'nombre', 'descripcion', 'orden', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

    return genero;
  }

  /**
   * Actualizar género
   */
  async actualizar(id, datosGenero) {
    const updateData = {};

    if (datosGenero.nombre !== undefined) updateData.nombre = datosGenero.nombre;
    if (datosGenero.descripcion !== undefined) updateData.descripcion = datosGenero.descripcion;
    if (datosGenero.orden !== undefined) updateData.orden = datosGenero.orden;
    if (datosGenero.activo !== undefined) updateData.activo = datosGenero.activo;

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    const [genero] = await db('generos')
      .where('id', id)
      .update(updateData)
      .returning(['id', 'nombre', 'descripcion', 'orden', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

    return genero || null;
  }

  /**
   * Eliminar género (soft delete - desactivar)
   */
  async eliminar(id) {
    const [genero] = await db('generos')
      .where('id', id)
      .update({
        activo: false,
        actualizado_en: db.fn.now()
      })
      .returning(['id', 'nombre', 'descripcion', 'orden', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

    return genero || null;
  }
}

export default new Genero();
