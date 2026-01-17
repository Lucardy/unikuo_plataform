import db from '../config/knex.js';

/**
 * Modelo de Usuario (Refactorizado con Knex)
 */
class Usuario {
  /**
   * Buscar usuario por email
   */
  async buscarPorEmail(email) {
    const usuario = await db('usuarios as u')
      .leftJoin('usuario_roles as ur', 'u.id', 'ur.usuario_id')
      .leftJoin('roles as r', 'ur.rol_id', 'r.id')
      .select([
        'u.id',
        'u.email',
        'u.contrasena',
        'u.nombre',
        'u.apellido',
        'u.activo',
        'u.email_verificado',
        'u.cliente_id',
        'u.creado_en',
        'u.actualizado_en',
        db.raw(`
          COALESCE(
            json_agg(
              json_build_object(
                'id', r.id,
                'nombre', r.nombre,
                'descripcion', r.descripcion
              )
            ) FILTER (WHERE r.id IS NOT NULL),
            '[]'
          ) as roles
        `)
      ])
      .where('u.email', email)
      .groupBy('u.id')
      .first();

    return usuario || null;
  }

  /**
   * Buscar usuario por ID
   */
  async buscarPorId(usuarioId, trx = null) {
    const query = (trx || db)('usuarios as u')
      .leftJoin('usuario_roles as ur', 'u.id', 'ur.usuario_id')
      .leftJoin('roles as r', 'ur.rol_id', 'r.id')
      .select([
        'u.id',
        'u.email',
        'u.nombre',
        'u.apellido',
        'u.activo',
        'u.email_verificado',
        'u.cliente_id',
        'u.creado_en',
        'u.actualizado_en',
        db.raw(`
          COALESCE(
            json_agg(
              json_build_object(
                'id', r.id,
                'nombre', r.nombre,
                'descripcion', r.descripcion
              )
            ) FILTER (WHERE r.id IS NOT NULL),
            '[]'
          ) as roles
        `)
      ])
      .where('u.id', usuarioId)
      .groupBy('u.id')
      .first();

    const usuario = await query;
    return usuario || null;
  }

  /**
   * Crear nuevo usuario
   */
  async crear(datosUsuario) {
    const { email, contrasena, nombre, apellido, rolesIds = [] } = datosUsuario;

    const nuevoUsuario = await db.transaction(async (trx) => {
      // Insertar usuario
      const [usuario] = await trx('usuarios')
        .insert({
          email,
          contrasena,
          nombre,
          apellido
        })
        .returning(['id']);

      // Asignar roles si se proporcionaron
      if (rolesIds.length > 0) {
        const rolesData = rolesIds.map(rolId => ({
          usuario_id: usuario.id,
          rol_id: rolId
        }));

        await trx('usuario_roles').insert(rolesData);
      }

      // Devolver usuario completo usando la misma transacción para lecturas consistentes
      return await this.buscarPorId(usuario.id, trx);
    });

    return nuevoUsuario;
  }

  /**
   * Verificar si el email ya existe
   */
  async existeEmail(email) {
    const result = await db('usuarios').where('email', email).select('id').first();
    return !!result;
  }

  /**
   * Obtener todos los roles disponibles
   */
  async obtenerRoles() {
    return await db('roles').select('id', 'nombre', 'descripcion').orderBy('nombre');
  }

  /**
   * Obtener todos los usuarios
   */
  async obtenerTodos(incluirInactivos = false) {
    const query = db('usuarios as u')
      .leftJoin('usuario_roles as ur', 'u.id', 'ur.usuario_id')
      .leftJoin('roles as r', 'ur.rol_id', 'r.id')
      .select([
        'u.id',
        'u.email',
        'u.nombre',
        'u.apellido',
        'u.activo',
        'u.email_verificado',
        'u.cliente_id',
        'u.creado_en',
        'u.actualizado_en',
        db.raw(`
          COALESCE(
            json_agg(
              json_build_object(
                'id', r.id,
                'nombre', r.nombre,
                'descripcion', r.descripcion
              )
            ) FILTER (WHERE r.id IS NOT NULL),
            '[]'
          ) as roles
        `)
      ])
      .groupBy('u.id')
      .orderBy('u.apellido')
      .orderBy('u.nombre');

    if (!incluirInactivos) {
      query.where('u.activo', true);
    }

    return await query;
  }

  /**
   * Actualizar usuario
   */
  async actualizar(usuarioId, datosUsuario) {
    const { email, nombre, apellido, activo, rolesIds } = datosUsuario;

    return await db.transaction(async (trx) => {
      const updateData = {};
      if (email !== undefined) updateData.email = email;
      if (nombre !== undefined) updateData.nombre = nombre;
      if (apellido !== undefined) updateData.apellido = apellido;
      if (activo !== undefined) updateData.activo = activo;

      if (Object.keys(updateData).length > 0) {
        updateData.actualizado_en = db.fn.now();
        await trx('usuarios').where('id', usuarioId).update(updateData);
      }

      if (rolesIds !== undefined) {
        await trx('usuario_roles').where('usuario_id', usuarioId).del();

        if (rolesIds.length > 0) {
          const rolesData = rolesIds.map(rolId => ({
            usuario_id: usuarioId,
            rol_id: rolId
          }));
          await trx('usuario_roles').insert(rolesData);
        }
      }

      return await this.buscarPorId(usuarioId, trx);
    });
  }

  /**
   * Cambiar contraseña de usuario
   */
  async cambiarContrasena(usuarioId, nuevaContrasena) {
    const { hashPassword } = await import('../utils/auth.js');
    const hashedContrasena = await hashPassword(nuevaContrasena);

    const [id] = await db('usuarios')
      .where('id', usuarioId)
      .update({
        contrasena: hashedContrasena,
        actualizado_en: db.fn.now()
      })
      .returning('id');

    // En knex returning devuelve array de objetos si no se especifica campo, o objetos si especificamos
    // Pero aquí devolvemos {id: ...} para mantener compatibilidad
    return id;
  }

  /**
   * Activar usuario
   */
  async activar(usuarioId) {
    const [id] = await db('usuarios')
      .where('id', usuarioId)
      .update({
        activo: true,
        actualizado_en: db.fn.now()
      })
      .returning('id');
    return id;
  }

  /**
   * Desactivar usuario
   */
  async desactivar(usuarioId) {
    const [id] = await db('usuarios')
      .where('id', usuarioId)
      .update({
        activo: false,
        actualizado_en: db.fn.now()
      })
      .returning('id');
    return id;
  }
}

export default new Usuario();
