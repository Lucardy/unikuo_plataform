# 🗺️ Roadmap Backend - Unikuo Platform

## 📋 Objetivo

Construir un backend sólido y completo para la plataforma, basado en la estructura de `estructuratienda` pero adaptado a Node.js/PostgreSQL.

## 🎯 Fases de Desarrollo

### ✅ FASE 1: COMPLETADA
- [x] Autenticación y roles (users, roles, user_roles)
- [x] Sistema de migraciones
- [x] Configuración Docker
- [x] Conexión a BD del VPS

---

### ✅ FASE 2: PRODUCTOS BÁSICOS (COMPLETADA)

**Objetivo:** Crear la estructura básica de productos con categorías e imágenes.

#### 2.1 Categorías
- [x] Tabla `categories` (con parent_id para jerarquía)
- [x] Modelo `Category.js`
- [x] Rutas CRUD: `/api/categories`
- [x] Endpoints: GET, POST, PUT, DELETE
- [x] Soporte para subcategorías

#### 2.2 Productos Básicos
- [x] Tabla `products` (productos)
- [x] Modelo `Product.js`
- [x] Rutas CRUD: `/api/products`
- [x] Endpoints: GET, POST, PUT, DELETE
- [x] Campos: nombre, descripcion, precio, precio_oferta, codigo, estado, destacado

#### 2.3 Imágenes de Productos
- [x] Tabla `product_images`
- [x] Modelo `ProductImage.js`
- [x] Rutas: `/api/products/:id/images`
- [x] Endpoints: GET, POST, PUT, DELETE
- [x] Soporte para imagen principal y orden

**Migración:** `002_productos_basicos.sql` ✅

---

### ✅ FASE 3: ATRIBUTOS DE PRODUCTOS (COMPLETADA)

**Objetivo:** Agregar atributos que enriquecen los productos (marcas, talles, colores).

#### 3.1 Marcas
- [x] Tabla `brands` (marcas)
- [x] Tabla `product_brands` (relación muchos a muchos)
- [x] Modelo `Brand.js`
- [x] Rutas: `/api/brands`
- [x] Asociación con productos

#### 3.2 Talles
- [x] Tabla `size_types` (tipos de talle: Alfabético, Numérico, etc.)
- [x] Tabla `sizes` (talles específicos)
- [x] Tabla `product_sizes` (relación)
- [x] Modelo `SizeType.js`, `Size.js`
- [x] Rutas: `/api/sizes`, `/api/sizes/types`

#### 3.3 Colores
- [x] Tabla `colors`
- [x] Tabla `product_colors`
- [x] Modelo `Color.js`
- [x] Rutas: `/api/colors`
- [x] Soporte para código HEX

**Migración:** `003_atributos_productos.sql` ✅

---

### ✅ FASE 4: STOCK Y GESTIÓN (COMPLETADA)

**Objetivo:** Sistema de gestión de stock por producto/talle/color.

#### 4.1 Stock Básico
- [x] Tabla `product_stock`
- [x] Modelo `ProductStock.js`
- [x] Rutas: `/api/stock/products/:id`
- [x] Endpoints: GET, POST, PUT
- [x] Campos: cantidad, stock_minimo, stock_maximo

#### 4.2 Movimientos de Stock
- [x] Tabla `stock_movements`
- [x] Modelo `StockMovement.js`
- [x] Rutas: `/api/stock/movements`
- [x] Tipos: entrada, salida, ajuste
- [x] Historial de movimientos

**Migración:** `004_stock.sql` ✅

---

### ✅ FASE 5: PRECIOS Y OFERTAS (COMPLETADA)

**Objetivo:** Sistema de precios por cantidad y ofertas.

#### 5.1 Precios por Cantidad
- [x] Tabla `price_quantity` (precios_cantidad)
- [x] Modelo `PriceQuantity.js`
- [x] Rutas: `/api/products/:id/prices`
- [x] Descuentos por cantidad

#### 5.2 Videos de Productos
- [x] Tabla `product_videos`
- [x] Modelo `ProductVideo.js`
- [x] Rutas: `/api/products/:id/videos`

**Migración:** `005_precios_videos.sql` ✅

---

### ✅ FASE 6: VENTAS Y PEDIDOS (COMPLETADA)

**Objetivo:** Sistema básico de ventas.

#### 6.1 Ventas
- [x] Tabla `sales` (ventas)
- [x] Tabla `sale_items` (items_venta)
- [x] Modelo `Sale.js`
- [x] Rutas: `/api/sales`
- [x] Estados: pendiente, confirmada, cancelada
- [x] Generación automática de número de factura

**Migración:** `006_ventas.sql` ✅

---

### 🎯 FASE 7: FEATURES AVANZADOS (Prioridad Baja)

#### 7.1 Géneros
- [ ] Tabla `genders` (generos)
- [ ] Tabla `product_genders`
- [ ] Modelo `Gender.js`

#### 7.2 Medidas Personalizadas
- [ ] Tabla `measure_types`
- [ ] Tabla `measures`
- [ ] Tabla `product_measures`

#### 7.3 Banners
- [ ] Tabla `banners`
- [ ] Modelo `Banner.js`
- [ ] Rutas: `/api/banners`

**Migración:** `007_features_avanzados.sql`

---

## 📝 Orden de Implementación Recomendado

### Sprint 1 (Ahora)
1. ✅ Categorías (Fase 2.1)
2. ✅ Productos Básicos (Fase 2.2)
3. ✅ Imágenes (Fase 2.3)

### Sprint 2
1. Marcas (Fase 3.1)
2. Talles (Fase 3.2)
3. Colores (Fase 3.3)

### Sprint 3
1. Stock Básico (Fase 4.1)
2. Movimientos de Stock (Fase 4.2)

### Sprint 4+
1. Ventas
2. Features avanzados según necesidad

---

## 🏗️ Estructura de Archivos Backend

```
backend/src/
├── models/
│   ├── User.js ✅
│   ├── Category.js
│   ├── Product.js
│   ├── ProductImage.js
│   ├── Brand.js
│   ├── Size.js
│   ├── Color.js
│   └── ...
├── routes/
│   ├── auth.routes.js ✅
│   ├── categories.routes.js
│   ├── products.routes.js
│   ├── brands.routes.js
│   └── ...
├── controllers/
│   ├── CategoryController.js
│   ├── ProductController.js
│   └── ...
└── middleware/
    ├── auth.js ✅
    └── ...
```

---

## 📊 Comparación con estructuratienda

| Feature | estructuratienda (PHP) | unikuo_plataform (Node.js) | Estado |
|---------|------------------------|----------------------------|--------|
| Autenticación | ✅ | ✅ | Completado |
| Roles | ✅ | ✅ | Completado |
| Categorías | ✅ | ⏳ | Pendiente |
| Productos | ✅ | ⏳ | Pendiente |
| Imágenes | ✅ | ⏳ | Pendiente |
| Marcas | ✅ | ⏳ | Pendiente |
| Talles | ✅ | ⏳ | Pendiente |
| Colores | ✅ | ⏳ | Pendiente |
| Stock | ✅ | ⏳ | Pendiente |
| Ventas | ✅ | ⏳ | Pendiente |

---

## 🎯 Próximos Pasos Inmediatos

1. **Crear migración `002_productos_basicos.sql`**
   - Tabla categorias
   - Tabla products
   - Tabla product_images

2. **Crear modelos:**
   - `Category.js`
   - `Product.js`
   - `ProductImage.js`

3. **Crear rutas y controladores:**
   - `/api/categories`
   - `/api/products`

4. **Probar con endpoints básicos**

---

## 💡 Notas

- Usar UUIDs en lugar de INT AUTO_INCREMENT (ya configurado)
- Mantener consistencia con estructura de `estructuratienda`
- Adaptar a PostgreSQL (diferencias con MySQL)
- Priorizar funcionalidades más usadas primero
- Ir de a poco, probando cada fase antes de continuar
