import pool from '../../config/database.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getStockReport = asyncHandler(async (req, res) => {
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
        COALESCE(ps.cantidad, 0) as cantidad,
        COALESCE(ps.stock_minimo, 0) as stock_minimo,
        COALESCE(ps.stock_maximo, 0) as stock_maximo,
        CASE 
          WHEN COALESCE(ps.cantidad, 0) = 0 THEN 'sin_stock'
          WHEN COALESCE(ps.cantidad, 0) <= COALESCE(ps.stock_minimo, 0) THEN 'bajo_stock'
          ELSE 'normal'
        END as estado
      FROM productos p
      LEFT JOIN producto_stock ps ON p.id = ps.producto_id
      ${condicionCliente}
      ORDER BY ps.cantidad ASC, p.nombre ASC
    `;

    const resultado = await pool.query(consulta, params.length > 0 ? params : []);

    // Calcular estadísticas
    const estadisticas = {
        total_productos: resultado.rows.length,
        sin_stock: resultado.rows.filter(p => p.estado === 'sin_stock').length,
        stock_bajo: resultado.rows.filter(p => p.estado === 'bajo_stock').length,
        normal: resultado.rows.filter(p => p.estado === 'normal').length,
        unidades_totales: resultado.rows.reduce((suma, p) => suma + parseInt(p.cantidad || 0), 0),
    };

    res.json({
        success: true,
        data: {
            stock: resultado.rows,
            estadisticas,
        },
    });
});
