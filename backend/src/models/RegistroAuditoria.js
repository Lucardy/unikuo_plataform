import db from '../config/knex.js';

/**
 * Modelo de Registro de Auditoría (Refactorizado con Knex)
 */
class RegistroAuditoria {
  /**
    * Registrar acción en auditoría
    */
  async crear(datosAuditoria) {
    const {
      cliente_id,
      usuario_id,
      accion,
      nombre_tabla,
      registro_id,
      datos_antes,
      datos_despues,
      direccion_ip,
      agente_usuario,
    } = datosAuditoria;

    try {
      const [registro] = await db('registros_auditoria')
        .insert({
          cliente_id: cliente_id || null,
          usuario_id: usuario_id || null,
          accion,
          nombre_tabla: nombre_tabla || null,
          registro_id: registro_id || null,
          datos_antes: datos_antes ? JSON.stringify(datos_antes) : null,
          datos_despues: datos_despues ? JSON.stringify(datos_despues) : null,
          direccion_ip: direccion_ip || null,
          agente_usuario: agente_usuario || null
        })
        .returning([
          'id', 'cliente_id', 'usuario_id', 'accion', 'nombre_tabla', 'registro_id',
          'datos_antes', 'datos_despues', 'direccion_ip', 'agente_usuario', 'creado_en'
        ]);

      return registro;
    } catch (error) {
      console.error('Error al crear registro de auditoría:', error);
      throw error;
    }
  }

  /**
    * Obtener todos los registros de auditoría con filtros
    */
  async obtenerTodos(filtros = {}) {
    const {
      cliente_id = null,
      usuario_id = null,
      accion = null,
      nombre_tabla = null,
      fecha_desde = null,
      fecha_hasta = null,
      limite = 100,
      offset = 0,
    } = filtros;

    const query = db('registros_auditoria as ra')
      .leftJoin('usuarios as u', 'ra.usuario_id', 'u.id')
      .select([
        'ra.id',
        'ra.cliente_id',
        'ra.usuario_id',
        'ra.accion',
        'ra.nombre_tabla',
        'ra.registro_id',
        'ra.datos_antes',
        'ra.datos_despues',
        'ra.direccion_ip',
        'ra.agente_usuario',
        'ra.creado_en',
        db.raw("u.nombre || ' ' || u.apellido as nombre_usuario"),
        'u.email as email_usuario'
      ])
      .orderBy('ra.creado_en', 'desc')
      .limit(limite)
      .offset(offset);

    if (cliente_id !== null) {
      query.where('ra.cliente_id', cliente_id);
    }

    if (usuario_id) {
      query.where('ra.usuario_id', usuario_id);
    }

    if (accion) {
      query.where('ra.accion', accion);
    }

    if (nombre_tabla) {
      query.where('ra.nombre_tabla', nombre_tabla);
    }

    if (fecha_desde) {
      query.where('ra.creado_en', '>=', fecha_desde);
    }

    if (fecha_hasta) {
      query.where('ra.creado_en', '<=', fecha_hasta);
    }

    return await query;
  }

  /**
    * Obtener registro de auditoría por ID
    */
  async obtenerPorId(id) {
    return await db('registros_auditoria as ra')
      .leftJoin('usuarios as u', 'ra.usuario_id', 'u.id')
      .select([
        'ra.id',
        'ra.cliente_id',
        'ra.usuario_id',
        'ra.accion',
        'ra.nombre_tabla',
        'ra.registro_id',
        'ra.datos_antes',
        'ra.datos_despues',
        'ra.direccion_ip',
        'ra.agente_usuario',
        'ra.creado_en',
        db.raw("u.nombre || ' ' || u.apellido as nombre_usuario"),
        'u.email as email_usuario'
      ])
      .where('ra.id', id)
      .first();
  }

  /**
    * Obtener estadísticas de auditoría
    */
  async obtenerEstadisticas(cliente_id = null, fecha_desde = null, fecha_hasta = null) {
    const query = db('registros_auditoria')
      .count('* as total_registros')
      .countDistinct('usuario_id as usuarios_unicos')
      .countDistinct('accion as acciones_unicas')
      .countDistinct('nombre_tabla as tablas_unicas');

    if (cliente_id !== null) {
      query.where('cliente_id', cliente_id);
    }

    if (fecha_desde) {
      query.where('creado_en', '>=', fecha_desde);
    }

    if (fecha_hasta) {
      query.where('creado_en', '<=', fecha_hasta);
    }

    const result = await query.first();

    return result || {
      total_registros: 0,
      usuarios_unicos: 0,
      acciones_unicas: 0,
      tablas_unicas: 0,
    };
  }
}

export default new RegistroAuditoria();
