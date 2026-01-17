import db from '../config/knex.js';

/**
 * Modelo de Rol (Refactorizado con Knex)
 */
class Rol {
  /**
   * Obtener todos los roles
   */
  async obtenerTodos() {
    return await db('roles')
      .select('roles.*', db.raw('(SELECT COUNT(*) FROM usuario_roles WHERE usuario_roles.rol_id = roles.id) as cantidad_usuarios'))
      .orderBy('nombre');
  }

  /**
   * Obtener rol por ID
   */
  async obtenerPorId(id) {
    return await db('roles')
      .select('roles.*', db.raw('(SELECT COUNT(*) FROM usuario_roles WHERE usuario_roles.rol_id = roles.id) as cantidad_usuarios'))
      .where('id', id)
      .first();
  }

  /**
   * Obtener rol por nombre
   */
  async obtenerPorNombre(nombre) {
    return await db('roles')
      .where('nombre', nombre)
      .first();
  }

  /**
   * Crear nuevo rol
   */
  async crear(datosRol) {
    const { nombre, descripcion } = datosRol;

    const existe = await this.obtenerPorNombre(nombre);
    if (existe) {
      throw new Error('Ya existe un rol con ese nombre');
    }

    const [rol] = await db('roles')
      .insert({ nombre, descripcion })
      .returning(['id', 'nombre', 'descripcion', 'creado_en', 'actualizado_en']);

    return rol;
  }

  /**
   * Actualizar rol
   */
  async actualizar(id, datosRol) {
    const { nombre, descripcion } = datosRol;
    const updateData = {};

    if (nombre !== undefined) {
      const existe = await this.obtenerPorNombre(nombre);
      if (existe && existe.id !== id) {
        throw new Error('Ya existe un rol con ese nombre');
      }
      updateData.nombre = nombre;
    }

    if (descripcion !== undefined) {
      updateData.descripcion = descripcion;
    }

    if (Object.keys(updateData).length === 0) {
      return await this.obtenerPorId(id);
    }

    updateData.actualizado_en = db.fn.now();

    const [rol] = await db('roles')
      .where('id', id)
      .update(updateData)
      .returning(['id', 'nombre', 'descripcion', 'creado_en', 'actualizado_en']);

    return rol || null;
  }

  /**
   * Eliminar rol
   */
  async eliminar(id) {
    const resultadoVerificacion = await db('usuario_roles')
      .where('rol_id', id)
      .count('* as count')
      .first();

    const cantidadUsuarios = parseInt(resultadoVerificacion.count);

    if (cantidadUsuarios > 0) {
      throw new Error(`No se puede eliminar el rol porque ${cantidadUsuarios} usuario(s) lo tienen asignado`);
    }

    const [rol] = await db('roles')
      .where('id', id)
      .del()
      .returning('id');

    return rol || null;
  }
}

export default new Rol();
