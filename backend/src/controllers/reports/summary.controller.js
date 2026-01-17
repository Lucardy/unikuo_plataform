import pool from '../../config/database.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getSummaryReport = asyncHandler(async (req, res) => {
  const clienteId = req.usuario?.cliente_id || null;
  const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];
  const esAdmin = rolesUsuario.includes('admin');

  // Construir condición de cliente
  let condicionCliente = '';
  const params = [];
  let paramIndex = 1;

  if (!esAdmin && clienteId) {
    condicionCliente = `WHERE cliente_id = $${paramIndex++}`;
    params.push(clienteId);
  }

  // Estadísticas de productos
  const consultaProductos = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE estado = 'activo') as activos,
        COUNT(*) FILTER (WHERE estado = 'inactivo') as inactivos
      FROM productos
      ${condicionCliente}
    `;
  const resultadoProductos = await pool.query(consultaProductos, params);

  // Estadísticas de categorías
  const consultaCategorias = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE activo = true) as activas,
        COUNT(*) FILTER (WHERE activo = false) as inactivas
      FROM categorias
      ${condicionCliente}
    `;
  const resultadoCategorias = await pool.query(consultaCategorias, params);

  // Estadísticas de clientes
  const consultaClientes = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE activo = true) as activos,
        COUNT(*) FILTER (WHERE activo = false) as inactivos
      FROM clientes_finales
      ${condicionCliente}
    `;
  const resultadoClientes = await pool.query(consultaClientes, params);

  // Estadísticas de usuarios
  const consultaUsuarios = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE activo = true) as activos,
        COUNT(*) FILTER (WHERE activo = false) as inactivos
      FROM usuarios
      ${condicionCliente}
    `;
  const resultadoUsuarios = await pool.query(consultaUsuarios, params);

  // Estadísticas de stock
  let condicionStock = '';
  const parametrosStock = [];
  let indiceParametroStock = 1;

  if (!esAdmin && clienteId) {
    condicionStock = `WHERE p.cliente_id = $${indiceParametroStock++}`;
    parametrosStock.push(clienteId);
  }

  const consultaStock = `
      SELECT 
        COUNT(DISTINCT ps.producto_id) as total_productos,
        COUNT(*) FILTER (WHERE ps.cantidad <= ps.stock_minimo AND ps.cantidad > 0) as stock_bajo,
        COUNT(*) FILTER (WHERE ps.cantidad = 0) as sin_stock,
        SUM(ps.cantidad) as unidades_totales
      FROM producto_stock ps
      JOIN productos p ON ps.producto_id = p.id
      ${condicionStock}
    `;
  const resultadoStock = await pool.query(consultaStock, parametrosStock.length > 0 ? parametrosStock : []);

  res.json({
    success: true,
    data: {
      productos: resultadoProductos.rows[0],
      categorias: resultadoCategorias.rows[0],
      clientes: resultadoClientes.rows[0],
      usuarios: resultadoUsuarios.rows[0],
      stock: resultadoStock.rows[0],
    },
  });
});
