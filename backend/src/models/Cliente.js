import db from '../config/knex.js';

/**
 * Modelo de Cliente (Tenant/Tienda) (Refactorizado con Knex)
 */
class Cliente {
  /**
   * Campos comunes a seleccionar
   */
  get selectFields() {
    return [
      'c.id',
      'c.nombre',
      'c.slug',
      'c.email',
      'c.telefono',
      'c.dominio',
      'c.activo',
      'c.theme_config',
      'c.layout_config',
      'c.componentes_config',
      'c.propietario_id',
      'c.created_at as creado_en',
      'c.updated_at as actualizado_en'
    ];
  }

  /**
   * Obtener todos los clientes (tiendas)
   */
  async obtenerTodos(incluirInactivas = false) {
    const query = db('clientes as c')
      .leftJoin('usuarios as u', 'c.propietario_id', 'u.id')
      .select([
        ...this.selectFields,
        'u.email as email_propietario',
        'u.nombre as nombre_propietario',
        'u.apellido as apellido_propietario'
      ])
      .orderBy('c.nombre');

    if (!incluirInactivas) {
      query.where('c.activo', true);
    }

    return await query;
  }

  /**
   * Obtener cliente por ID
   */
  async obtenerPorId(id) {
    return await db('clientes as c')
      .leftJoin('usuarios as u', 'c.propietario_id', 'u.id')
      .select([
        ...this.selectFields,
        'u.email as email_propietario',
        'u.nombre as nombre_propietario',
        'u.apellido as apellido_propietario'
      ])
      .where('c.id', id)
      .first();
  }

  /**
   * Obtener cliente por slug
   */
  async obtenerPorSlug(slug) {
    return await db('clientes as c')
      .select(this.selectFields)
      .where('c.slug', slug)
      .where('c.activo', true)
      .first();
  }

  /**
   * Obtener cliente por dominio
   */
  async obtenerPorDominio(dominio) {
    return await db('clientes as c')
      .select(this.selectFields)
      .where('c.dominio', dominio)
      .where('c.activo', true)
      .first();
  }

  /**
   * Obtener cliente de un usuario
   */
  async obtenerPorUsuarioId(usuarioId) {
    return await db('clientes as c')
      .select(this.selectFields)
      .where('c.propietario_id', usuarioId)
      .where('c.activo', true)
      .first();
  }

  /**
   * Crear nuevo cliente
   */
  async crear(datosCliente) {
    const {
      nombre,
      slug,
      email,
      telefono,
      dominio,
      propietario_id,
      activo = true,
      theme_config = {},
      layout_config = {},
      componentes_config = {}
    } = datosCliente;

    const [cliente] = await db('clientes')
      .insert({
        nombre,
        slug,
        email: email || null,
        telefono: telefono || null,
        dominio: dominio || null,
        propietario_id: propietario_id || null,
        activo,
        theme_config,
        layout_config,
        componentes_config
      })
      .returning([
        'id',
        'nombre',
        'slug',
        'email',
        'telefono',
        'dominio',
        'activo',
        'theme_config',
        'layout_config',
        'componentes_config',
        'propietario_id',
        'created_at as creado_en',
        'updated_at as actualizado_en'
      ]);

    return cliente;
  }

  /**
   * Actualizar cliente
   */
  async actualizar(id, datosCliente) {
    const {
      nombre, slug, email, telefono, dominio, propietario_id, activo,
      theme_config, layout_config, componentes_config
    } = datosCliente;

    const updateData = {};

    if (nombre !== undefined) updateData.nombre = nombre;
    if (slug !== undefined) updateData.slug = slug;
    if (email !== undefined) updateData.email = email;
    if (telefono !== undefined) updateData.telefono = telefono;
    if (dominio !== undefined) updateData.dominio = dominio;
    if (propietario_id !== undefined) updateData.propietario_id = propietario_id;
    if (activo !== undefined) updateData.activo = activo;
    if (theme_config !== undefined) updateData.theme_config = theme_config;
    if (layout_config !== undefined) updateData.layout_config = layout_config;
    if (componentes_config !== undefined) updateData.componentes_config = componentes_config;

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.updated_at = db.fn.now();

    const [cliente] = await db('clientes')
      .where('id', id)
      .update(updateData)
      .returning([
        'id',
        'nombre',
        'slug',
        'email',
        'telefono',
        'dominio',
        'activo',
        'theme_config',
        'layout_config',
        'componentes_config',
        'propietario_id',
        'created_at as creado_en',
        'updated_at as actualizado_en'
      ]);

    return cliente || null;
  }

  /**
   * Eliminar cliente (soft delete)
   */
  async eliminar(id) {
    const [cliente] = await db('clientes')
      .where('id', id)
      .update({
        activo: false,
        updated_at: db.fn.now()
      })
      .returning('id');

    return cliente || null;
  }

  /**
   * Verificar si el slug ya existe
   */
  async existeSlug(slug, excluirId = null) {
    const query = db('clientes').where('slug', slug);

    if (excluirId) {
      query.whereNot('id', excluirId);
    }

    const result = await query.first();
    return !!result;
  }
}

export default new Cliente();
