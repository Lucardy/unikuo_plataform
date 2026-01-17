export const PRODUCT_DETAILS_FIELDS = `
  p.id,
  p.categoria_id,
  p.nombre,
  p.descripcion,
  p.precio,
  p.precio_oferta,
  p.precio_transferencia,
  p.codigo,
  p.estado,
  p.destacado,
  p.creado_en,
  p.actualizado_en,
  c.nombre as nombre_categoria,
  (
    SELECT json_agg(
      json_build_object(
        'id', pi.id,
        'nombre_archivo', pi.nombre_archivo,
        'ruta', pi.ruta,
        'es_principal', pi.es_principal,
        'orden', pi.orden
      ) ORDER BY pi.orden
    )
    FROM producto_imagenes pi
    WHERE pi.producto_id = p.id
  ) as imagenes,
  (
    SELECT json_agg(
      json_build_object(
        'id', b.id,
        'nombre', b.nombre,
        'url_logo', b.url_logo
      )
    )
    FROM marcas b
    INNER JOIN producto_marcas pb ON b.id = pb.marca_id
    WHERE pb.producto_id = p.id AND b.activo = true
  ) as marcas,
  (
    SELECT json_agg(
      json_build_object(
        'id', s.id,
        'nombre', s.nombre,
        'tipo_talle_id', s.tipo_talle_id,
        'nombre_tipo_talle', st.nombre
      ) ORDER BY s.orden
    )
    FROM talles s
    INNER JOIN producto_talles ps ON s.id = ps.talle_id
    INNER JOIN tipos_talle st ON s.tipo_talle_id = st.id
    WHERE ps.producto_id = p.id
  ) as talles,
  (
    SELECT json_agg(
      json_build_object(
        'id', cl.id,
        'nombre', cl.nombre,
        'codigo_hex', cl.codigo_hex,
        'mostrar_color', cl.mostrar_color
      ) ORDER BY cl.orden
    )
    FROM colores cl
    INNER JOIN producto_colores pc ON cl.id = pc.color_id
    WHERE pc.producto_id = p.id AND cl.activo = true
  ) as colores
`;

export const PRODUCT_STOCK_SUBQUERY = `
  (
    SELECT json_build_object(
      'id', ps.id,
      'cantidad', ps.cantidad,
      'stock_minimo', ps.stock_minimo,
      'max_stock', ps.max_stock
    )
    FROM producto_stock ps
    WHERE ps.producto_id = p.id
  ) as stock
`;

export const BASE_PRODUCT_QUERY = `
  SELECT 
    ${PRODUCT_DETAILS_FIELDS}
  FROM productos p
  LEFT JOIN categorias c ON p.categoria_id = c.id
  WHERE 1=1
`;

export const PRODUCT_BY_ID_QUERY = `
  SELECT 
    ${PRODUCT_DETAILS_FIELDS},
    ${PRODUCT_STOCK_SUBQUERY}
  FROM productos p
  LEFT JOIN categorias c ON p.categoria_id = c.id
  WHERE p.id = $1
`;
