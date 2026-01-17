export const SALE_DETAILS_FIELDS = `
  v.id,
  v.numero_factura,
  v.total,
  v.subtotal,
  v.total_descuento,
  v.fecha_venta,
  v.usuario_id,
  v.cliente_final_id,
  v.nombre_cliente,
  v.documento_cliente,
  v.metodo_pago,
  v.codigo_descuento,
  v.estado,
  v.notas,
  v.creado_en,
  v.actualizado_en,
  u.email as email_usuario,
  u.nombre as nombre_usuario,
  u.apellido as apellido_usuario
`;

export const SALE_ITEMS_SUBQUERY = `
  (
    SELECT json_agg(
      json_build_object(
        'id', vi.id,
        'producto_id', vi.producto_id,
        'cantidad', vi.cantidad,
        'precio_unitario', vi.precio_unitario,
        'subtotal', vi.subtotal,
        'descuento', vi.descuento,
        'nombre_producto', p.nombre,
        'codigo_producto', p.codigo
      )
    )
    FROM venta_items vi
    INNER JOIN productos p ON vi.producto_id = p.id
    WHERE vi.venta_id = v.id
  ) as items
`;

export const BASE_SALE_QUERY = `
  SELECT 
    ${SALE_DETAILS_FIELDS},
    (
      SELECT json_agg(
        json_build_object(
          'id', vi.id,
          'producto_id', vi.producto_id,
          'cantidad', vi.cantidad,
          'precio_unitario', vi.precio_unitario,
          'subtotal', vi.subtotal,
          'descuento', vi.descuento,
          'nombre_producto', p.nombre
        )
      )
      FROM venta_items vi
      INNER JOIN productos p ON vi.producto_id = p.id
      WHERE vi.venta_id = v.id
    ) as items
  FROM ventas v
  INNER JOIN usuarios u ON v.usuario_id = u.id
  WHERE 1=1
`;

export const SALE_BY_ID_QUERY = `
  SELECT 
    ${SALE_DETAILS_FIELDS},
    ${SALE_ITEMS_SUBQUERY}
  FROM ventas v
  INNER JOIN usuarios u ON v.usuario_id = u.id
  WHERE v.id = $1
`;
