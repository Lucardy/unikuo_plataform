# 🔐 Variables de Entorno para PostgreSQL

## 📝 Actualizar .env Local

En la raíz del proyecto, edita `.env` y agrega:

```env
# ... variables existentes ...

# Base de datos PostgreSQL
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password
```

## 📝 Actualizar .env en el VPS

En el VPS, edita `.env`:

```bash
cd /root/unikuo_plataform
nano .env
```

Agrega las mismas variables (usa una contraseña segura en producción):

```env
# ... variables existentes ...

# Base de datos PostgreSQL
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=tu_password_seguro_aqui
```

**⚠️ IMPORTANTE**: Cambia `tu_password_seguro_aqui` por una contraseña segura en producción.

## ✅ Ejemplo Completo de .env

### Local (Desarrollo)
```env
NODE_ENV=development
BACKEND_PORT=3001
FRONTEND_PORT=80
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost
ALLOWED_ORIGINS=http://localhost,http://127.0.0.1

# Base de datos PostgreSQL
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password
```

### VPS (Producción)
```env
NODE_ENV=production
BACKEND_PORT=3001
FRONTEND_PORT=80
API_URL=http://89.117.33.122:3001
FRONTEND_URL=http://89.117.33.122
ALLOWED_ORIGINS=http://89.117.33.122

# Base de datos PostgreSQL
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=password_super_seguro_123
```

## 🔄 Después de Actualizar .env

### Local:
```powershell
docker compose down
docker compose build
docker compose up -d
```

### VPS:
```bash
docker compose down
docker compose build backend
docker compose up -d
```
