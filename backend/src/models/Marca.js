import db from '../config/knex.js';

/**
 * Modelo de Marca (Refactorizado con Knex)
 */
class Marca {
  /**
   * Obtener todas las marcas
   */
  async obtenerTodas(incluirInactivas = false, clienteId = null) {
    const query = db('marcas')
      .select([
        'id',
        'nombre',
        'descripcion',
        'url_logo',
        'activo',
        'creado_en',
        'actualizado_en'
      ])
      .orderBy('nombre');

    if (clienteId !== null) {
      query.where('cliente_id', clienteId);
    }

    if (!incluirInactivas) {
      query.where('activo', true);
    }

    return await query;
  }

  /**
   * Obtener marca por ID
   */
  async obtenerPorId(id) {
    return await db('marcas as b')
      .select([
        'b.id',
        'b.nombre',
        'b.descripcion',
        'b.url_logo',
        'b.activo',
        'b.creado_en',
        'b.actualizado_en',
        'b.cliente_id',
        db.raw('(SELECT COUNT(*) FROM producto_marcas pb WHERE pb.marca_id = b.id) as cantidad_productos')
      ])
      .where('b.id', id)
      .first();
  }

  /**
   * Crear nueva marca
   */
  async crear(datosMarca) {
    const { nombre, descripcion, url_logo, activo = true, cliente_id } = datosMarca;

    const [marca] = await db('marcas')
      .insert({
        nombre,
        descripcion: descripcion || null,
        url_logo: url_logo || null,
        activo,
        cliente_id: cliente_id || null
      })
      .returning(['id', 'nombre', 'descripcion', 'url_logo', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

    return marca;
  }

  /**
   * Actualizar marca
   */
  async actualizar(id, datosMarca) {
    const updateData = {};
    const mapeoCampos = {
      nombre: 'nombre',
      descripcion: 'descripcion',
      url_logo: 'url_logo',
      activo: 'activo'
    };

    for (const campo in mapeoCampos) {
      if (datosMarca[campo] !== undefined) {
        updateData[mapeoCampos[campo]] = datosMarca[campo];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    const [marca] = await db('marcas')
      .where('id', id)
      .update(updateData)
      .returning(['id', 'nombre', 'descripcion', 'url_logo', 'activo', 'creado_en', 'actualizado_en']);

    return marca || null;
  }

  /**
   * Eliminar marca (soft delete)
   */
  async eliminar(id) {
    const [marca] = await db('marcas')
      .where('id', id)
      .update({
        activo: false,
        actualizado_en: db.fn.now()
      })
      .returning('id');

    return marca || null;
  }

  /**
   * Asociar marca a producto
   */
  async asociarAProducto(productoId, marcaId) {
    try {
      const [relacion] = await db('producto_marcas')
        .insert({ producto_id: productoId, marca_id: marcaId })
        .onConflict(['producto_id', 'marca_id'])
        .ignore()
        .returning('id');
      return relacion || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Desasociar marca de producto
   */
  async desasociarDeProducto(productoId, marcaId) {
    const [relacion] = await db('producto_marcas')
      .where({ producto_id: productoId, marca_id: marcaId })
      .del()
      .returning('id');

    return relacion || null;
  }

  /**
   * Obtener marcas de un producto
   */
  async obtenerPorProductoId(productoId) {
    return await db('marcas as b')
      .innerJoin('producto_marcas as pb', 'b.id', 'pb.marca_id')
      .select([
        'b.id',
        'b.nombre',
        'b.descripcion',
        'b.url_logo',
        'b.activo'
      ])
      .where('pb.producto_id', productoId)
      .where('b.activo', true)
      .orderBy('b.nombre');
  }
}

export default new Marca();
