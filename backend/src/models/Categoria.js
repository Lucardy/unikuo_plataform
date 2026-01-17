import db from '../config/knex.js';

/**
 * Modelo de Categoría (Refactorizado con Knex)
 */
class Categoria {
  /**
   * Obtener todas las categorías
   */
  async obtenerTodas(incluirInactivas = false, clienteId = null) {
    const query = db('categorias as c')
      .leftJoin('categorias as padre', 'c.categoria_padre_id', 'padre.id')
      .select([
        'c.id',
        'c.nombre',
        'c.descripcion',
        'c.categoria_padre_id',
        'c.activo',
        'c.creado_en',
        'c.actualizado_en',
        'padre.nombre as nombre_categoria_padre'
      ])
      .orderBy('c.nombre');

    if (clienteId) {
      query.where('c.cliente_id', clienteId);
    }

    if (!incluirInactivas) {
      query.where('c.activo', true);
    }

    return await query;
  }

  /**
   * Obtener categoría por ID
   */
  async obtenerPorId(id) {
    return await db('categorias as c')
      .leftJoin('categorias as padre', 'c.categoria_padre_id', 'padre.id')
      .select([
        'c.id',
        'c.nombre',
        'c.descripcion',
        'c.categoria_padre_id',
        'c.activo',
        'c.creado_en',
        'c.actualizado_en',
        'padre.nombre as nombre_categoria_padre',
        db.raw(`
          (
            SELECT json_agg(
              json_build_object(
                'id', h.id,
                'nombre', h.nombre,
                'descripcion', h.descripcion,
                'activo', h.activo
              )
            )
            FROM categorias h
            WHERE h.categoria_padre_id = c.id AND h.activo = true
          ) as subcategorias
        `)
      ])
      .where('c.id', id)
      .first();
  }

  /**
   * Crear nueva categoría
   */
  async crear(datosCategoria) {
    const { nombre, descripcion, categoria_padre_id, activo = true, cliente_id } = datosCategoria;

    const [categoria] = await db('categorias')
      .insert({
        nombre,
        descripcion,
        categoria_padre_id: categoria_padre_id || null,
        activo,
        cliente_id: cliente_id || null
      })
      .returning(['id', 'nombre', 'descripcion', 'categoria_padre_id', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

    return categoria;
  }

  /**
   * Actualizar categoría
   */
  async actualizar(id, datosCategoria) {
    const { nombre, descripcion, categoria_padre_id, activo } = datosCategoria;
    const updateData = {};

    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (categoria_padre_id !== undefined) updateData.categoria_padre_id = categoria_padre_id || null;
    if (activo !== undefined) updateData.activo = activo;

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    const [categoria] = await db('categorias')
      .where('id', id)
      .update(updateData)
      .returning(['id', 'nombre', 'descripcion', 'categoria_padre_id', 'activo', 'creado_en', 'actualizado_en']);

    return categoria || null;
  }

  /**
   * Eliminar categoría (soft delete)
   */
  async eliminar(id) {
    const [categoria] = await db('categorias')
      .where('id', id)
      .update({
        activo: false,
        actualizado_en: db.fn.now()
      })
      .returning('id');

    return categoria || null;
  }

  /**
   * Obtener categorías raíz (sin padre)
   */
  async obtenerCategoriasRaiz() {
    return await db('categorias as c')
      .select([
        'c.id',
        'c.nombre',
        'c.descripcion',
        'c.activo',
        'c.creado_en',
        'c.actualizado_en'
      ])
      .whereNull('c.categoria_padre_id')
      .where('c.activo', true)
      .orderBy('c.nombre');
  }

  /**
   * Obtener subcategorías de una categoría
   */
  async obtenerSubcategorias(idPadre) {
    return await db('categorias as c')
      .select([
        'c.id',
        'c.nombre',
        'c.descripcion',
        'c.activo',
        'c.creado_en',
        'c.actualizado_en'
      ])
      .where('c.categoria_padre_id', idPadre)
      .where('c.activo', true)
      .orderBy('c.nombre');
  }
}

export default new Categoria();
