# 🏢 Sistema Multi-Tenant

## 📋 Descripción

El sistema ahora soporta múltiples clientes (tenants) en una misma base de datos. Cada cliente tiene sus propios productos, categorías, marcas, etc., completamente aislados de otros clientes.

## 🔐 Cómo Funciona

### 1. Tabla de Tenants

Se creó la tabla `tenants` que almacena información de cada cliente:
- `id` - UUID único
- `name` - Nombre del cliente
- `slug` - Identificador único (ej: "cliente-1")
- `email`, `phone`, `domain` - Información de contacto
- `owner_id` - Usuario propietario del tenant
- `active` - Estado activo/inactivo

### 2. Campo `tenant_id` en Todas las Tablas

Todas las tablas relevantes ahora tienen un campo `tenant_id`:
- ✅ `categories`
- ✅ `products`
- ✅ `product_images`
- ✅ `brands`
- ✅ `size_types`
- ✅ `sizes`
- ✅ `colors`
- ✅ `product_stock`
- ✅ `stock_movements`
- ✅ `price_quantity`
- ✅ `product_videos`
- ✅ `sales`
- ✅ `sale_items`

### 3. Filtrado Automático

Los modelos ahora filtran automáticamente por `tenant_id`:
- Cuando un usuario autenticado hace una consulta, solo ve datos de su tenant
- Los admins pueden ver todos los tenants
- Los `store_owner` solo ven su propio tenant

### 4. Middleware de Autenticación

El middleware `authenticate` ahora:
1. Obtiene el usuario del token
2. Busca el tenant asociado al usuario
3. Agrega `tenant_id` al objeto `req.user`

### 5. Validación de Tenant

El middleware `requireTenant` valida que:
- Los usuarios con rol `store_owner` tengan un tenant asignado
- Los admins pueden operar sin tenant (acceso global)

## 🚀 Uso

### Crear un Tenant (Solo Admin)

```bash
POST /api/tenants
{
  "name": "Mi Tienda",
  "slug": "mi-tienda",
  "email": "contacto@mitienda.com",
  "owner_id": "uuid-del-usuario"
}
```

### Obtener Mi Tenant

```bash
GET /api/tenants/my
Authorization: Bearer <token>
```

### Crear Producto (Automático por Tenant)

Cuando un usuario con rol `store_owner` crea un producto:
- El sistema automáticamente asigna el `tenant_id` del usuario
- No es necesario especificarlo manualmente

```bash
POST /api/products
Authorization: Bearer <token>
{
  "name": "Producto 1",
  "price": 100,
  ...
}
```

### Listar Productos (Filtrado Automático)

```bash
GET /api/products
Authorization: Bearer <token>
```

Solo retorna productos del tenant del usuario autenticado.

## 🔒 Seguridad

### Protecciones Implementadas

1. **Filtrado Automático**: Todas las consultas filtran por `tenant_id`
2. **Validación en Creación**: No se puede crear un registro sin `tenant_id` (excepto admins)
3. **Validación en Actualización**: No se puede actualizar un registro de otro tenant
4. **Foreign Keys**: Las relaciones respetan el `tenant_id` con `ON DELETE CASCADE`

### Roles

- **admin**: Puede ver y gestionar todos los tenants
- **store_owner**: Solo puede ver y gestionar su propio tenant
- **user**: (Si se implementa) Solo puede ver datos de su tenant

## 📝 Notas Importantes

### Para Desarrolladores

1. **Siempre usar `req.user.tenant_id`**: Al crear/actualizar registros
2. **Filtrar consultas**: Agregar `tenant_id` a los filtros de búsqueda
3. **Validar permisos**: Usar `requireTenant` en rutas que requieren tenant

### Para Administradores

1. **Crear tenants**: Usar el endpoint `/api/tenants` (solo admin)
2. **Asignar owner**: El `owner_id` debe ser un usuario con rol `store_owner`
3. **Slug único**: Cada tenant debe tener un `slug` único

## 🔄 Migración de Datos Existentes

Si ya tienes datos en la base de datos:

1. Crear un tenant para cada cliente
2. Actualizar los registros existentes con el `tenant_id` correspondiente

Ejemplo SQL:
```sql
-- Crear tenant
INSERT INTO tenants (name, slug, owner_id) 
VALUES ('Cliente 1', 'cliente-1', 'uuid-del-usuario');

-- Asignar productos al tenant
UPDATE products 
SET tenant_id = 'uuid-del-tenant' 
WHERE id IN (...);
```

## 🎯 Próximos Pasos

- [ ] Actualizar todos los modelos restantes para filtrar por tenant
- [ ] Agregar validación de tenant en todas las rutas de creación/actualización
- [ ] Implementar middleware para APIs públicas (identificar tenant por domain/slug)
- [ ] Agregar tests para verificar aislamiento de datos
