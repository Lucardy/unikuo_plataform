import db from '../config/knex.js';

/**
 * Modelo de Cliente
 */
class ClienteFinal {
  /**
   * Obtener todos los clientes
   */
  async obtenerTodos(clienteId = null, includeInactive = false, search = '') {
    const query = db('clientes_finales')
      .select([
        'id',
        'cliente_id',
        'nombre',
        'apellido',
        'email',
        'telefono',
        'direccion',
        'documento',
        'fecha_nacimiento',
        'notas',
        'activo',
        'creado_en',
        'actualizado_en'
      ])
      .orderBy(['apellido', 'nombre']);

    // Filtrar por cliente_id si se proporciona
    if (clienteId !== null) {
      query.where('cliente_id', clienteId);
    }

    // Filtrar por búsqueda
    if (search) {
      query.where(builder => {
        builder.where('nombre', 'ilike', `%${search}%`)
          .orWhere('apellido', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
          .orWhere('documento', 'ilike', `%${search}%`);
      });
    }

    // Filtrar inactivos
    if (!includeInactive) {
      query.where('activo', true);
    }

    return await query;
  }

  /**
   * Obtener cliente por ID
   */
  async obtenerPorId(id) {
    return await db('clientes_finales')
      .select([
        'id',
        'cliente_id',
        'nombre',
        'apellido',
        'email',
        'telefono',
        'direccion',
        'documento',
        'fecha_nacimiento',
        'notas',
        'activo',
        'creado_en',
        'actualizado_en'
      ])
      .where('id', id)
      .first() || null;
  }

  /**
   * Crear nuevo cliente
   */
  async crear(clienteData) {
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      documento,
      fecha_nacimiento,
      notas,
      activo = true,
      cliente_id,
    } = clienteData;

    try {
      const [cliente] = await db('clientes_finales')
        .insert({
          nombre,
          apellido,
          email: email || null,
          telefono: telefono || null,
          direccion: direccion || null,
          documento: documento || null,
          fecha_nacimiento: fecha_nacimiento || null,
          notas: notas || null,
          activo,
          cliente_id: cliente_id || null
        })
        .returning([
          'id', 'nombre', 'apellido', 'email', 'telefono', 'direccion',
          'documento', 'fecha_nacimiento', 'notas', 'activo', 'cliente_id',
          'creado_en', 'actualizado_en'
        ]);

      return cliente;
    } catch (error) {
      console.error('Error al crear cliente final:', error);
      throw error;
    }
  }

  /**
   * Actualizar cliente
   */
  async actualizar(id, clienteData) {
    const updateData = {};
    const fields = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'documento', 'fecha_nacimiento', 'notas', 'activo'];

    fields.forEach(field => {
      if (clienteData[field] !== undefined) {
        updateData[field] = clienteData[field] === undefined ? null : clienteData[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    const [cliente] = await db('clientes_finales')
      .where('id', id)
      .update(updateData)
      .returning([
        'id', 'nombre', 'apellido', 'email', 'telefono', 'direccion',
        'documento', 'fecha_nacimiento', 'notas', 'activo', 'cliente_id',
        'creado_en', 'actualizado_en'
      ]);

    return cliente || null;
  }

  /**
   * Eliminar cliente (soft delete)
   */
  async eliminar(id) {
    const [cliente] = await db('clientes_finales')
      .where('id', id)
      .update({
        activo: false,
        actualizado_en: db.fn.now()
      })
      .returning('id');

    return cliente || null;
  }
}

export default new ClienteFinal();
