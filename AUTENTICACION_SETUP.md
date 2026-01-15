# 🔐 Sistema de Autenticación y Roles - Setup Completo

## ✅ Lo que se ha creado

### Base de Datos
- ✅ Tabla `roles` - Roles del sistema (admin, user, store_owner)
- ✅ Tabla `users` - Usuarios con email, password, nombre, apellido
- ✅ Tabla `user_roles` - Relación muchos a muchos entre usuarios y roles
- ✅ Índices para mejorar rendimiento
- ✅ Triggers para `updated_at` automático

### Backend
- ✅ Dependencias: `bcrypt`, `jsonwebtoken`
- ✅ Utilidades de autenticación (`utils/auth.js`)
- ✅ Modelo de Usuario (`models/User.js`)
- ✅ Middleware de autenticación (`middleware/auth.js`)
- ✅ Rutas de autenticación (`routes/auth.routes.js`)
- ✅ Script para crear admin inicial (`scripts/createAdmin.js`)

### Frontend
- ✅ Contexto de autenticación (`contexts/AuthContext.tsx`)
- ✅ Componente Login (`components/Login/Login.tsx`)
- ✅ Componente Register (`components/Register/Register.tsx`)
- ✅ Servicio API actualizado con métodos de autenticación
- ✅ App.tsx actualizado para mostrar Login/Register cuando no está autenticado

---

## 🚀 Cómo Usar

### 1. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

Esto instalará `bcrypt` y `jsonwebtoken`.

### 2. Recrear la Base de Datos (para aplicar las nuevas tablas)

**Opción A: Recrear desde cero (borra datos existentes)**
```bash
# Detener servicios
docker compose -f docker-compose.dev.yml down

# Eliminar volumen de la base de datos
docker volume rm unikuo_plataform_postgres-data-dev

# Iniciar de nuevo (creará las nuevas tablas)
docker compose -f docker-compose.dev.yml up -d
```

**Opción B: Ejecutar SQL manualmente (mantiene datos)**
```bash
# Conectarse a la base de datos
docker compose -f docker-compose.dev.yml exec database psql -U unikuo_user -d unikuo_plataform

# Copiar y pegar el contenido de database/init.sql desde la línea de "TABLAS DE AUTENTICACIÓN"
```

### 3. Crear Usuario Administrador (Opcional)

```bash
# Desde el contenedor del backend
docker compose -f docker-compose.dev.yml exec backend node src/scripts/createAdmin.js

# O desde tu máquina (si tienes Node.js local)
cd backend
node src/scripts/createAdmin.js
```

**Credenciales por defecto:**
- Email: `admin@unikuo.com`
- Password: `admin123`

**⚠️ IMPORTANTE:** Cambia estas credenciales en producción.

### 4. Reiniciar Backend

```bash
docker compose -f docker-compose.dev.yml restart backend
```

### 5. Probar en el Frontend

1. Abre http://localhost:5173
2. Verás la pantalla de Login
3. Puedes:
   - **Registrarte** (crear nueva cuenta)
   - **Iniciar sesión** (si ya tienes cuenta)

---

## 📋 Endpoints Disponibles

### Autenticación

**POST /api/auth/register**
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "first_name": "Juan",
  "last_name": "Pérez",
  "roleIds": ["uuid-del-rol"] // Opcional
}
```

**POST /api/auth/login**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**GET /api/auth/me** (requiere autenticación)
- Header: `Authorization: Bearer <token>`
- Retorna información del usuario autenticado

**GET /api/auth/roles**
- Retorna todos los roles disponibles

---

## 🎯 Flujo de Uso

### Registro
1. Usuario completa el formulario de registro
2. Se crea el usuario en la base de datos
3. Se genera un token JWT
4. El token se guarda en `localStorage`
5. El usuario queda autenticado

### Login
1. Usuario ingresa email y contraseña
2. Se verifica credenciales
3. Se genera un token JWT
4. El token se guarda en `localStorage`
5. El usuario queda autenticado

### Acceso Protegido
- Las rutas protegidas usan el middleware `authenticate`
- El token se envía en el header: `Authorization: Bearer <token>`
- Si el token es inválido, se retorna 401

---

## 🔒 Seguridad

### Variables de Entorno

Agrega a tu `.env`:
```env
JWT_SECRET=tu-secret-key-muy-segura-cambiar-en-produccion
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANTE:** Cambia `JWT_SECRET` en producción por una clave segura y aleatoria.

### Contraseñas
- Se hashean con bcrypt (10 salt rounds)
- Nunca se almacenan en texto plano
- Nunca se envían en respuestas del API

---

## 🧪 Probar el Sistema

### 1. Registrar un Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Guardar el `token` de la respuesta.

### 3. Obtener Información del Usuario

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <tu-token>"
```

---

## 📝 Próximos Pasos

- [ ] Agregar validación de email (verificación por correo)
- [ ] Agregar recuperación de contraseña
- [ ] Agregar refresh tokens
- [ ] Agregar permisos más granulares
- [ ] Agregar rate limiting para login
- [ ] Agregar logs de auditoría

---

## 🆘 Solución de Problemas

### "Cannot find module 'bcrypt'"
```bash
cd backend
npm install
```

### "Table 'users' does not exist"
- Recrea la base de datos o ejecuta el SQL manualmente

### "Token inválido"
- Verifica que `JWT_SECRET` esté configurado
- Verifica que el token no haya expirado

### "Email ya existe"
- El email ya está registrado, usa otro o inicia sesión

---

## ✅ Estado

**Sistema de autenticación completo y funcional:**
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Protección de rutas
- ✅ Sistema de roles
- ✅ Frontend integrado

¡Listo para usar! 🚀
