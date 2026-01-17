import db from '../config/knex.js';

/**
 * Modelo de Stock de Producto (Refactorizado con Knex)
 */
class StockProducto {
  /**
    * Obtener stock de un producto
    */
  async findByProductId(productoId, clienteId = null) {
    const query = db('producto_stock')
      .where('producto_id', productoId);

    if (clienteId) {
      query.where('cliente_id', clienteId);
    }

    const result = await query.first();
    return result || null;
  }

  /**
    * Crear o actualizar stock
    */
  async upsert(productoId, datosStock) {
    const { cantidad = 0, stock_minimo = 0, stock_maximo = 0, cliente_id } = datosStock;

    const [result] = await db('producto_stock')
      .insert({
        producto_id,
        cantidad,
        stock_minimo,
        stock_maximo,
        cliente_id: cliente_id || null
      })
      .onConflict('producto_id')
      .merge({
        cantidad: db.raw('EXCLUDED.cantidad'),
        stock_minimo: db.raw('EXCLUDED.stock_minimo'),
        stock_maximo: db.raw('EXCLUDED.stock_maximo'),
        cliente_id: db.raw('EXCLUDED.cliente_id'),
        actualizado_en: db.fn.now()
      })
      .returning([
        'id', 'producto_id', 'cantidad', 'stock_minimo', 'stock_maximo', 'cliente_id', 'creado_en', 'actualizado_en'
      ]);

    return result;
  }

  /**
    * Actualizar cantidad de stock
    */
  async updateQuantity(productoId, cantidad, usuarioId = null) {
    return await db.transaction(async (trx) => {
      // Obtener stock actual
      const stockActual = await trx('producto_stock')
        .where('producto_id', productoId)
        .first();

      const cantidadAnterior = stockActual ? stockActual.cantidad : 0;

      // Determinar tipo de movimiento
      let tipoMovimiento = 'ajuste';
      if (cantidad > cantidadAnterior) {
        tipoMovimiento = 'entrada';
      } else if (cantidad < cantidadAnterior) {
        tipoMovimiento = 'salida';
      }

      // Actualizar o crear stock
      const [result] = await trx('producto_stock')
        .insert({
          producto_id: productoId,
          cantidad: cantidad
        })
        .onConflict('producto_id')
        .merge({
          cantidad: db.raw('EXCLUDED.cantidad'),
          actualizado_en: db.fn.now()
        })
        .returning([
          'id', 'producto_id', 'cantidad', 'stock_minimo', 'stock_maximo', 'creado_en', 'actualizado_en'
        ]);

      // Registrar movimiento manualmente
      if (usuarioId) {
        await trx('movimientos_stock').insert({
          producto_id: productoId,
          tipo: tipoMovimiento,
          cantidad: Math.abs(cantidad - cantidadAnterior),
          usuario_id: usuarioId
        });
      }

      return result;
    });
  }

  /**
    * Agregar stock (entrada)
    */
  async addStock(productoId, cantidad, razon = null, usuarioId = null) {
    const stockActual = await this.findByProductId(productoId);
    const cantidadActual = stockActual ? stockActual.cantidad : 0;
    const nuevaCantidad = cantidadActual + cantidad; // cantidad is handled as number

    return await this.updateQuantity(productoId, nuevaCantidad, usuarioId);
  }

  /**
    * Reducir stock (salida)
    */
  async reduceStock(productoId, cantidad, razon = null, usuarioId = null) {
    const stockActual = await this.findByProductId(productoId);
    const cantidadActual = stockActual ? stockActual.cantidad : 0;
    const nuevaCantidad = Math.max(0, cantidadActual - cantidad);

    return await this.updateQuantity(productoId, nuevaCantidad, usuarioId);
  }

  /**
    * Obtener todos los productos con stock
    */
  async findAll(clienteId = null, soloStockBajo = false) {
    const query = db('producto_stock as ps')
      .join('productos as p', 'ps.producto_id', 'p.id')
      .select([
        'ps.id',
        'ps.producto_id',
        'ps.cantidad',
        'ps.stock_minimo',
        'ps.stock_maximo',
        'ps.cliente_id',
        'ps.creado_en',
        'ps.actualizado_en',
        'p.nombre as nombre_producto',
        'p.codigo as codigo_producto',
        'p.estado as estado_producto',
        db.raw(`
          CASE 
            WHEN ps.cantidad <= 0 THEN 'Sin stock'
            WHEN ps.cantidad < ps.stock_minimo THEN 'Bajo stock'
            ELSE 'Normal'
          END AS estado_stock
        `)
      ]);

    if (clienteId !== null) {
      query.where('ps.cliente_id', clienteId);
    }

    if (soloStockBajo) {
      query.where(builder => {
        builder.whereRaw('ps.cantidad <= ps.stock_minimo').orWhereRaw('ps.cantidad <= 0');
      });
    }

    query.orderBy('p.nombre', 'asc');

    return await query;
  }

  /**
    * Obtener estadísticas de stock
    */
  async getStatistics(clienteId = null) {
    const query = db('producto_stock as ps')
      .join('productos as p', 'ps.producto_id', 'p.id')
      .select([
        db.raw('COUNT(DISTINCT ps.producto_id) as total_productos'),
        db.raw('COUNT(DISTINCT CASE WHEN ps.cantidad <= 0 THEN ps.producto_id END) as productos_sin_stock'),
        db.raw('COUNT(DISTINCT CASE WHEN ps.cantidad > 0 AND ps.cantidad < ps.stock_minimo THEN ps.producto_id END) as productos_stock_bajo'),
        db.raw('COALESCE(SUM(ps.cantidad), 0) as unidades_totales')
      ]);

    if (clienteId !== null) {
      query.where('ps.cliente_id', clienteId);
    }

    // Note: Implicit group by not needed here as these are aggregate functions on the whole set

    const result = await query.first();
    return result ? {
      total_productos: parseInt(result.total_productos),
      productos_sin_stock: parseInt(result.productos_sin_stock),
      productos_stock_bajo: parseInt(result.productos_stock_bajo),
      unidades_totales: parseInt(result.unidades_totales)
    } : {
      total_productos: 0,
      productos_sin_stock: 0,
      productos_stock_bajo: 0,
      unidades_totales: 0,
    };
  }

  /**
    * Obtener productos con stock bajo
    */
  async findLowStock(clienteId = null) {
    const query = db('producto_stock as ps')
      .join('productos as p', 'ps.producto_id', 'p.id')
      .select([
        'ps.id',
        'ps.producto_id',
        'ps.cantidad',
        'ps.stock_minimo',
        'ps.stock_maximo',
        'p.nombre as nombre_producto',
        'p.codigo as codigo_producto'
      ])
      .where(builder => {
        builder.whereRaw('ps.cantidad <= ps.stock_minimo').orWhereRaw('ps.cantidad <= 0');
      })
      .andWhere('p.estado', 'active');

    if (clienteId !== null) {
      query.where('ps.cliente_id', clienteId);
    }

    query.orderByRaw('(ps.cantidad - ps.stock_minimo) ASC');

    return await query;
  }
}

export default new StockProducto();
