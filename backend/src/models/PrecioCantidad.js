import db from '../config/knex.js';

/**
 * Modelo de Precio por Cantidad (Refactorizado con Knex)
 */
class PrecioCantidad {
  /**
   * Obtener precios por cantidad de un producto
   */
  async obtenerPorProductoId(productoId, clienteId = null) {
    const query = db('precio_cantidad')
      .where('producto_id', productoId)
      .andWhere('activo', true);

    if (clienteId) {
      query.andWhere('cliente_id', clienteId);
    }

    query.orderBy('orden').orderBy('cantidad_minima');

    return await query;
  }

  /**
   * Crear precio por cantidad
   */
  async crear(datosPrecio) {
    const {
      producto_id,
      cantidad_minima,
      cantidad_maxima,
      precio,
      porcentaje_descuento,
      activo = true,
      orden = 0,
      cliente_id,
    } = datosPrecio;

    if (!cliente_id) {
      throw new Error('cliente_id es requerido para crear un precio por cantidad');
    }

    const [nuevoPrecio] = await db('precio_cantidad')
      .insert({
        producto_id,
        cantidad_minima,
        cantidad_maxima: cantidad_maxima || null,
        precio,
        porcentaje_descuento: porcentaje_descuento || null,
        activo,
        orden,
        cliente_id
      })
      .returning([
        'id', 'producto_id', 'cantidad_minima', 'cantidad_maxima', 'precio',
        'porcentaje_descuento', 'activo', 'orden', 'cliente_id', 'creado_en', 'actualizado_en'
      ]);

    return nuevoPrecio;
  }

  /**
   * Actualizar precio por cantidad
   */
  async actualizar(id, datosPrecio) {
    const mapeoCampos = {
      cantidad_minima: 'cantidad_minima',
      cantidad_maxima: 'cantidad_maxima',
      precio: 'precio',
      porcentaje_descuento: 'porcentaje_descuento',
      activo: 'activo',
      orden: 'orden',
    };

    const updateData = {};
    for (const campo in mapeoCampos) {
      if (datosPrecio[campo] !== undefined) {
        updateData[campo] = datosPrecio[campo];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return null;
    }

    updateData.actualizado_en = db.fn.now();

    const [precioActualizado] = await db('precio_cantidad')
      .where('id', id)
      .update(updateData)
      .returning([
        'id', 'producto_id', 'cantidad_minima', 'cantidad_maxima', 'precio',
        'porcentaje_descuento', 'activo', 'orden', 'creado_en', 'actualizado_en'
      ]);

    return precioActualizado || null;
  }

  /**
   * Eliminar precio por cantidad
   */
  async eliminar(id) {
    const [resultado] = await db('precio_cantidad')
      .where('id', id)
      .del()
      .returning('id');

    return resultado || null;
  }

  /**
   * Obtener precio según cantidad
   */
  async obtenerPrecioPorCantidad(productoId, cantidad) {
    const precio = await db('precio_cantidad')
      .where('producto_id', productoId)
      .andWhere('activo', true)
      .andWhere('cantidad_minima', '<=', cantidad)
      .where(builder => {
        builder.whereNull('cantidad_maxima').orWhere('cantidad_maxima', '>=', cantidad);
      })
      .orderBy('cantidad_minima', 'desc')
      .first();

    return precio || null;
  }
}

export default new PrecioCantidad();
