import pool from '../../config/database.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getProductsReport = asyncHandler(async (req, res) => {
    const clienteId = req.usuario?.cliente_id || null;
    const rolesUsuario = req.usuario?.roles?.map(rol => rol.nombre || rol) || [];
    const esAdmin = rolesUsuario.includes('admin');

    let condicionCliente = '';
    const params = [];
    let paramIndex = 1;

    if (!esAdmin && clienteId) {
        condicionCliente = `WHERE p.cliente_id = $${paramIndex++}`;
        params.push(clienteId);
    }

    const consulta = `
      SELECT 
        p.id,
        p.nombre,
        p.codigo as sku,
        p.precio,
        p.estado,
        c.nombre as nombre_categoria,
        COALESCE(ps.cantidad, 0) as cantidad_stock,
        COALESCE(ps.stock_minimo, 0) as stock_minimo,
        COALESCE(ps.stock_maximo, 0) as stock_maximo,
        CASE 
          WHEN COALESCE(ps.cantidad, 0) = 0 THEN 'sin_stock'
          WHEN COALESCE(ps.cantidad, 0) <= COALESCE(ps.stock_minimo, 0) THEN 'bajo_stock'
          ELSE 'normal'
        END as estado_stock
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN producto_stock ps ON p.id = ps.producto_id
      ${condicionCliente}
      ORDER BY p.nombre ASC
    `;

    const resultado = await pool.query(consulta, params.length > 0 ? params : []);

    res.json({
        success: true,
        data: {
            productos: resultado.rows,
        },
    });
});
