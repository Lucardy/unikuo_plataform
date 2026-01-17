-- Parte 2: Renombrar columnas restantes

-- producto_imagenes
ALTER TABLE producto_imagenes RENAME COLUMN product_id TO producto_id;
ALTER TABLE producto_imagenes RENAME COLUMN image_url TO url_imagen;
ALTER TABLE producto_imagenes RENAME COLUMN alt_text TO texto_alt;
ALTER TABLE producto_imagenes RENAME COLUMN order_index TO orden;
ALTER TABLE producto_imagenes RENAME COLUMN is_primary TO es_principal;
ALTER TABLE producto_imagenes RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE producto_imagenes RENAME COLUMN created_at TO creado_en;

-- producto_videos
ALTER TABLE producto_videos RENAME COLUMN product_id TO producto_id;
ALTER TABLE producto_videos RENAME COLUMN video_url TO url_video;
ALTER TABLE producto_videos RENAME COLUMN thumbnail_url TO url_miniatura;
ALTER TABLE producto_videos RENAME COLUMN order_index TO orden;
ALTER TABLE producto_videos RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE producto_videos RENAME COLUMN created_at TO creado_en;

-- producto_stock
ALTER TABLE producto_stock RENAME COLUMN product_id TO producto_id;
ALTER TABLE producto_stock RENAME COLUMN size_id TO talle_id;
ALTER TABLE producto_stock RENAME COLUMN quantity TO cantidad;
ALTER TABLE producto_stock RENAME COLUMN reserved_quantity TO cantidad_reservada;
ALTER TABLE producto_stock RENAME COLUMN min_stock TO stock_minimo;
ALTER TABLE producto_stock RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE producto_stock RENAME COLUMN created_at TO creado_en;
ALTER TABLE producto_stock RENAME COLUMN updated_at TO actualizado_en;

-- producto_marcas
ALTER TABLE producto_marcas RENAME COLUMN product_id TO producto_id;
ALTER TABLE producto_marcas RENAME COLUMN brand_id TO marca_id;
ALTER TABLE producto_marcas RENAME COLUMN created_at TO creado_en;

-- producto_colores
ALTER TABLE producto_colores RENAME COLUMN product_id TO producto_id;
ALTER TABLE producto_colores RENAME COLUMN created_at TO creado_en;

-- producto_talles
ALTER TABLE producto_talles RENAME COLUMN product_id TO producto_id;
ALTER TABLE producto_talles RENAME COLUMN size_id TO talle_id;
ALTER TABLE producto_talles RENAME COLUMN created_at TO creado_en;

-- precio_cantidad
ALTER TABLE precio_cantidad RENAME COLUMN product_id TO producto_id;
ALTER TABLE precio_cantidad RENAME COLUMN min_quantity TO cantidad_minima;
ALTER TABLE precio_cantidad RENAME COLUMN price TO precio;
ALTER TABLE precio_cantidad RENAME COLUMN active TO activo;
ALTER TABLE precio_cantidad RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE precio_cantidad RENAME COLUMN created_at TO creado_en;
ALTER TABLE precio_cantidad RENAME COLUMN updated_at TO actualizado_en;

-- movimientos_stock
ALTER TABLE movimientos_stock RENAME COLUMN product_id TO producto_id;
ALTER TABLE movimientos_stock RENAME COLUMN size_id TO talle_id;
ALTER TABLE movimientos_stock RENAME COLUMN type TO tipo;
ALTER TABLE movimientos_stock RENAME COLUMN quantity TO cantidad;
ALTER TABLE movimientos_stock RENAME COLUMN reason TO razon;
ALTER TABLE movimientos_stock RENAME COLUMN reference_id TO referencia_id;
ALTER TABLE movimientos_stock RENAME COLUMN user_id TO usuario_id;
ALTER TABLE movimientos_stock RENAME COLUMN notes TO notas;
ALTER TABLE movimientos_stock RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE movimientos_stock RENAME COLUMN created_at TO creado_en;

-- clientes_finales
ALTER TABLE clientes_finales RENAME COLUMN first_name TO nombre;
ALTER TABLE clientes_finales RENAME COLUMN last_name TO apellido;
ALTER TABLE clientes_finales RENAME COLUMN phone TO telefono;
ALTER TABLE clientes_finales RENAME COLUMN address TO direccion;
ALTER TABLE clientes_finales RENAME COLUMN city TO ciudad;
ALTER TABLE clientes_finales RENAME COLUMN state TO provincia;
ALTER TABLE clientes_finales RENAME COLUMN postal_code TO codigo_postal;
ALTER TABLE clientes_finales RENAME COLUMN country TO pais;
ALTER TABLE clientes_finales RENAME COLUMN notes TO notas;
ALTER TABLE clientes_finales RENAME COLUMN active TO activo;
ALTER TABLE clientes_finales RENAME COLUMN created_at TO creado_en;
ALTER TABLE clientes_finales RENAME COLUMN updated_at TO actualizado_en;

-- ventas
ALTER TABLE ventas RENAME COLUMN invoice_number TO numero_factura;
ALTER TABLE ventas RENAME COLUMN customer_id TO cliente_final_id;
ALTER TABLE ventas RENAME COLUMN user_id TO usuario_id;
ALTER TABLE ventas RENAME COLUMN shift_id TO turno_id;
ALTER TABLE ventas RENAME COLUMN sale_date TO fecha_venta;
ALTER TABLE ventas RENAME COLUMN discount TO descuento;
ALTER TABLE ventas RENAME COLUMN tax TO impuesto;
ALTER TABLE ventas RENAME COLUMN payment_method TO metodo_pago;
ALTER TABLE ventas RENAME COLUMN status TO estado;
ALTER TABLE ventas RENAME COLUMN notes TO notas;
ALTER TABLE ventas RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE ventas RENAME COLUMN created_at TO creado_en;
ALTER TABLE ventas RENAME COLUMN updated_at TO actualizado_en;

-- venta_items
ALTER TABLE venta_items RENAME COLUMN sale_id TO venta_id;
ALTER TABLE venta_items RENAME COLUMN product_id TO producto_id;
ALTER TABLE venta_items RENAME COLUMN size_id TO talle_id;
ALTER TABLE venta_items RENAME COLUMN quantity TO cantidad;
ALTER TABLE venta_items RENAME COLUMN unit_price TO precio_unitario;
ALTER TABLE venta_items RENAME COLUMN discount TO descuento;
ALTER TABLE venta_items RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE venta_items RENAME COLUMN created_at TO creado_en;

-- turnos_caja
ALTER TABLE turnos_caja RENAME COLUMN user_id TO usuario_id;
ALTER TABLE turnos_caja RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE turnos_caja RENAME COLUMN opening_date TO fecha_apertura;
ALTER TABLE turnos_caja RENAME COLUMN closing_date TO fecha_cierre;
ALTER TABLE turnos_caja RENAME COLUMN initial_amount TO monto_inicial;
ALTER TABLE turnos_caja RENAME COLUMN expected_cash_amount TO efectivo_esperado;
ALTER TABLE turnos_caja RENAME COLUMN actual_cash_amount TO efectivo_real;
ALTER TABLE turnos_caja RENAME COLUMN difference TO diferencia;
ALTER TABLE turnos_caja RENAME COLUMN total_sales TO total_ventas;
ALTER TABLE turnos_caja RENAME COLUMN total_cash TO total_efectivo;
ALTER TABLE turnos_caja RENAME COLUMN total_transfer TO total_transferencia;
ALTER TABLE turnos_caja RENAME COLUMN total_card TO total_tarjeta;
ALTER TABLE turnos_caja RENAME COLUMN sales_count TO cantidad_ventas;
ALTER TABLE turnos_caja RENAME COLUMN status TO estado;
ALTER TABLE turnos_caja RENAME COLUMN notes TO notas;
ALTER TABLE turnos_caja RENAME COLUMN created_at TO creado_en;
ALTER TABLE turnos_caja RENAME COLUMN updated_at TO actualizado_en;

-- banners
ALTER TABLE banners RENAME COLUMN title TO titulo;
ALTER TABLE banners RENAME COLUMN subtitle TO subtitulo;
ALTER TABLE banners RENAME COLUMN image_url TO url_imagen;
ALTER TABLE banners RENAME COLUMN link_url TO url_enlace;
ALTER TABLE banners RENAME COLUMN order_index TO orden;
ALTER TABLE banners RENAME COLUMN active TO activo;
ALTER TABLE banners RENAME COLUMN created_at TO creado_en;
ALTER TABLE banners RENAME COLUMN updated_at TO actualizado_en;
