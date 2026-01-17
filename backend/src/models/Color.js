import db from '../config/knex.js';

/**
 * Modelo de Color (Refactorizado con Knex)
 */
class Color {
  /**
   * Obtener todos los colores
   */
  async obtenerTodos(incluirInactivos = false, clienteId = null) {
    const query = db('colores')
      .select([
        'id',
        'nombre',
        'codigo_hex',
        'mostrar_color',
        'orden',
        'activo',
        'creado_en',
        'actualizado_en'
      ])
      .orderBy([
        { column: 'orden', order: 'asc' },
        { column: 'nombre', order: 'asc' }
      ]);

    if (clienteId !== null) {
      query.where('cliente_id', clienteId);
    }

    if (!incluirInactivos) {
      query.where('activo', true);
    }

    return await query;
  }

  /**
   * Obtener color por ID
   */
  async obtenerPorId(id) {
    return await db('colores as c')
      .select([
        'c.id',
        'c.nombre',
        'c.codigo_hex',
        'c.mostrar_color',
        'c.orden',
        'c.activo',
        'c.creado_en',
        'c.actualizado_en',
        'c.cliente_id',
        db.raw('(SELECT COUNT(*) FROM producto_colores pc WHERE pc.color_id = c.id) as cantidad_productos')
      ])
      .where('c.id', id)
      .first();
  }

  /**
   * Crear nuevo color
   */
  async crear(datosColor) {
    const { nombre, codigo_hex, mostrar_color = true, orden = 0, activo = true, cliente_id } = datosColor;

    const [color] = await db('colores')
      .insert({
        nombre,
        codigo_hex: codigo_hex || null,
        mostrar_color,
        orden,
        activo,
        cliente_id: cliente_id || null
      })
      .returning(['id', 'nombre', 'codigo_hex', 'mostrar_color', 'orden', 'activo', 'cliente_id', 'creado_en', 'actualizado_en']);

    return color;
  }

  /**
   * Actualizar color
   */
  async actualizar(id, datosColor) {
    const updateData = {};
    const mapeoCampos = {
      nombre: 'nombre',
      codigo_hex: 'codigo_hex',
      mostrar_color: 'mostrar_color',
      orden: 'orden',
      activo: 'activo'
    };

    for (const campo in mapeoCampos) {
      if (datosColor[campo] !== undefined) {
        updateData[mapeoCampos[campo]] = datosColor[campo];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    const [color] = await db('colores')
      .where('id', id)
      .update(updateData)
      .returning(['id', 'nombre', 'codigo_hex', 'mostrar_color', 'orden', 'activo', 'creado_en', 'actualizado_en']);

    return color || null;
  }

  /**
   * Eliminar color (soft delete)
   */
  async eliminar(id) {
    const [color] = await db('colores')
      .where('id', id)
      .update({
        activo: false,
        actualizado_en: db.fn.now()
      })
      .returning('id');

    return color || null;
  }

  /**
   * Asociar color a producto
   */
  async asociarAProducto(productoId, colorId) {
    try {
      const [relacion] = await db('producto_colores')
        .insert({ producto_id: productoId, color_id: colorId })
        .onConflict(['producto_id', 'color_id'])
        .ignore()
        .returning('id');
      return relacion || null;
    } catch (error) {
      // En caso de que Knex no soporte onConflict().ignore() en todas las versiones/DBs, fallback
      return null;
    }
  }

  /**
   * Desasociar color de producto
   */
  async desasociarDeProducto(productoId, colorId) {
    const [relacion] = await db('producto_colores')
      .where({ producto_id: productoId, color_id: colorId })
      .del()
      .returning('id');

    return relacion || null;
  }

  /**
   * Obtener colores de un producto
   */
  async obtenerPorProductoId(productoId) {
    return await db('colores as c')
      .innerJoin('producto_colores as pc', 'c.id', 'pc.color_id')
      .select([
        'c.id',
        'c.nombre',
        'c.codigo_hex',
        'c.mostrar_color',
        'c.orden'
      ])
      .where('pc.producto_id', productoId)
      .where('c.activo', true)
      .orderBy([
        { column: 'c.orden', order: 'asc' },
        { column: 'c.nombre', order: 'asc' }
      ]);
  }
}

export default new Color();
