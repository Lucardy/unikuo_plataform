import db from '../config/knex.js';
import { PRODUCT_DETAILS_FIELDS, PRODUCT_STOCK_SUBQUERY } from './queries/product.queries.js';

/**
 * Modelo de Producto (Refactorizado con Knex)
 */
class Producto {
  /**
   * Obtener todos los productos
   */
  async obtenerTodos(filtros = {}) {
    const { estado, categoria_id, destacado, busqueda, limite, offset, cliente_id } = filtros;

    const query = db('productos as p')
      .leftJoin('categorias as c', 'p.categoria_id', 'c.id')
      .select(db.raw(PRODUCT_DETAILS_FIELDS));

    if (cliente_id) {
      query.where('p.cliente_id', cliente_id);
    }

    if (estado) {
      query.where('p.estado', estado);
    }

    if (categoria_id) {
      query.where('p.categoria_id', categoria_id);
    }

    if (destacado !== undefined) {
      query.where('p.destacado', destacado);
    }

    if (busqueda) {
      query.where(builder => {
        builder.where('p.nombre', 'ilike', `%${busqueda}%`)
          .orWhere('p.descripcion', 'ilike', `%${busqueda}%`)
          .orWhere('p.codigo', 'ilike', `%${busqueda}%`);
      });
    }

    query.orderBy('p.creado_en', 'desc');

    if (limite) {
      query.limit(limite);
    }

    if (offset) {
      query.offset(offset);
    }

    return await query;
  }

  /**
   * Obtener producto por ID
   */
  async obtenerPorId(id) {
    const producto = await db('productos as p')
      .leftJoin('categorias as c', 'p.categoria_id', 'c.id')
      .select(db.raw(`${PRODUCT_DETAILS_FIELDS}, ${PRODUCT_STOCK_SUBQUERY}`))
      .where('p.id', id)
      .first();

    return producto || null;
  }

  /**
   * Crear nuevo producto
   */
  async crear(datosProducto) {
    const {
      categoria_id,
      nombre,
      descripcion,
      precio,
      precio_oferta,
      precio_transferencia,
      codigo,
      estado = 'active',
      destacado = false,
      cliente_id,
    } = datosProducto;

    const [nuevoProducto] = await db('productos')
      .insert({
        categoria_id: categoria_id || null,
        nombre,
        descripcion: descripcion || null,
        precio,
        precio_oferta: precio_oferta || null,
        precio_transferencia: precio_transferencia || null,
        codigo: codigo || null,
        estado,
        destacado,
        cliente_id: cliente_id || null
      })
      .returning([
        'id', 'categoria_id', 'nombre', 'descripcion', 'precio', 'precio_oferta',
        'precio_transferencia', 'codigo', 'estado', 'destacado', 'cliente_id',
        'creado_en', 'actualizado_en'
      ]);

    return nuevoProducto;
  }

  /**
   * Actualizar producto
   */
  async actualizar(id, datosProducto) {
    const camposPermitidos = [
      'categoria_id',
      'nombre',
      'descripcion',
      'precio',
      'precio_oferta',
      'precio_transferencia',
      'codigo',
      'estado',
      'destacado',
    ];

    const updateData = {};
    for (const campo of camposPermitidos) {
      if (datosProducto[campo] !== undefined) {
        updateData[campo] = datosProducto[campo];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    const [productoActualizado] = await db('productos')
      .where('id', id)
      .update(updateData)
      .returning([
        'id', 'categoria_id', 'nombre', 'descripcion', 'precio', 'precio_oferta',
        'precio_transferencia', 'codigo', 'estado', 'destacado', 'creado_en', 'actualizado_en'
      ]);

    return productoActualizado || null;
  }

  /**
   * Eliminar producto (soft delete)
   */
  async eliminar(id) {
    const [resultado] = await db('productos')
      .where('id', id)
      .update({
        estado: 'inactive',
        actualizado_en: db.fn.now()
      })
      .returning('id');

    return resultado || null;
  }

  /**
   * Verificar si el código ya existe
   */
  async existeCodigo(codigo, excluirId = null, clienteId = null) {
    const query = db('productos').where('codigo', codigo);

    if (clienteId) {
      query.where('cliente_id', clienteId);
    }

    if (excluirId) {
      query.whereNot('id', excluirId);
    }

    const resultado = await query.first();
    return !!resultado;
  }

  /**
   * Contar productos
   */
  async contar(filtros = {}) {
    const { estado, categoria_id, destacado } = filtros;
    const query = db('productos').count('* as total');

    if (estado) {
      query.where('estado', estado);
    }

    if (categoria_id) {
      query.where('categoria_id', categoria_id);
    }

    if (destacado !== undefined) {
      query.where('destacado', destacado);
    }

    const resultado = await query.first();
    return parseInt(resultado.total);
  }
}

export default new Producto();
