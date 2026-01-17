import db from '../config/knex.js';

/**
 * Modelo de Movimiento de Stock (Refactorizado con Knex)
 */
class MovimientoStock {
  /**
    * Obtener movimientos de un producto
    */
  async findByProductId(productoId, limite = 50, clienteId = null) {
    const query = db('movimientos_stock as ms')
      .join('productos as p', 'ms.producto_id', 'p.id')
      .leftJoin('usuarios as u', 'ms.usuario_id', 'u.id')
      .select([
        'ms.id',
        'ms.producto_id',
        'ms.tipo',
        'ms.cantidad',
        'ms.razon',
        'ms.referencia_id',
        'ms.usuario_id',
        'ms.creado_en',
        'p.nombre as nombre_producto',
        'u.email as email_usuario'
      ])
      .where('ms.producto_id', productoId);

    if (clienteId) {
      query.where('ms.cliente_id', clienteId);
    }

    query.orderBy('ms.creado_en', 'desc').limit(limite);

    return await query;
  }

  /**
    * Obtener todos los movimientos (con filtros)
    */
  async findAll(filtros = {}) {
    const { producto_id, tipo, usuario_id, limite = 100, offset = 0, cliente_id } = filtros;

    const query = db('movimientos_stock as ms')
      .join('productos as p', 'ms.producto_id', 'p.id')
      .leftJoin('usuarios as u', 'ms.usuario_id', 'u.id')
      .select([
        'ms.id',
        'ms.producto_id',
        'ms.tipo',
        'ms.cantidad',
        'ms.razon',
        'ms.referencia_id',
        'ms.usuario_id',
        'ms.creado_en',
        'p.nombre as nombre_producto',
        'u.email as email_usuario'
      ]);

    if (producto_id) {
      query.where('ms.producto_id', producto_id);
    }

    if (tipo) {
      query.where('ms.tipo', tipo);
    }

    if (usuario_id) {
      query.where('ms.usuario_id', usuario_id);
    }

    if (cliente_id) {
      query.where('ms.cliente_id', cliente_id);
    }

    query.orderBy('ms.creado_en', 'desc');

    if (limite) {
      query.limit(limite);
    }

    if (offset) {
      query.offset(offset);
    }

    return await query;
  }

  /**
    * Crear movimiento manual
    */
  async create(datosMovimiento) {
    const {
      producto_id,
      tipo,
      cantidad,
      razon,
      referencia_id,
      usuario_id,
      cliente_id,
    } = datosMovimiento;

    const [movimiento] = await db('movimientos_stock')
      .insert({
        producto_id,
        tipo,
        cantidad,
        razon: razon || null,
        referencia_id: referencia_id || null,
        usuario_id: usuario_id || null,
        cliente_id: cliente_id || null
      })
      .returning([
        'id', 'producto_id', 'tipo', 'cantidad', 'razon', 'referencia_id', 'usuario_id', 'cliente_id', 'creado_en'
      ]);

    return movimiento;
  }
}

export default new MovimientoStock();
