# 🚀 Inicio Rápido - Unikuo Platform

## 💻 Desarrollo Local

### Opción 1: Con Docker y Hot Reload (Recomendado para Desarrollo) ⚡

```bash
# 1. Abrir Docker Desktop (una vez al día)

# 2. Iniciar todo con hot reload
npm run docker:dev

# 3. Verificar estado
docker compose -f docker-compose.dev.yml ps

# 4. Acceder a la aplicación
# Frontend: http://localhost:5173 (hot reload ✅)
# Backend API: http://localhost:3000 (hot reload ✅)
```

**Detener servicios:**
```bash
npm run docker:down:dev
```

**Ventajas:**
- ✅ Cambios instantáneos (hot reload)
- ✅ No necesitas reconstruir constantemente
- ✅ Mejor experiencia de desarrollo

### Opción 2: Con Docker Producción (Para Probar Build Final)

```bash
# Iniciar
docker compose up -d

# Acceder
# Frontend: http://localhost
# Backend API: http://localhost:3000

# Detener
docker compose down
```

**Nota:** Para desarrollo diario, usa la Opción 1 (hot reload).

### Opción 2: Sin Docker (Desarrollo Rápido)

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # Solo la primera vez
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # Solo la primera vez
npm run dev
```

**Nota:** Si usas esta opción, necesitas PostgreSQL corriendo. Puedes usar Docker solo para la BD:
```bash
docker compose up -d database
```

---

## 🌐 Verificar en el VPS

### 1. Conectarse al VPS
```bash
ssh root@89.117.33.122
```

### 2. Ir al directorio del proyecto
```bash
cd /root/unikuo_plataform
```

### 3. Verificar estado de los servicios
```bash
docker compose ps
```

Deberías ver 3 servicios corriendo:
- `unikuo-backend` (healthy)
- `unikuo-database` (healthy)
- `unikuo-frontend` (healthy)

### 4. Ver logs (si hay problemas)
```bash
# Logs del backend
docker compose logs backend | tail -30

# Logs de la base de datos
docker compose logs database | tail -30

# Logs de todos los servicios
docker compose logs -f
```

### 5. Reiniciar servicios (si es necesario)
```bash
docker compose restart
```

### 6. Acceder a la aplicación
- Frontend: http://89.117.33.122
- Backend API: http://89.117.33.122:3001/api/test

---

## 📤 Flujo de Trabajo Diario

### 1. Hacer cambios en local
```bash
# Trabajar en tu código normalmente
# Probar con Docker o sin Docker (ver arriba)
```

### 2. Hacer commit y push
```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

### 3. GitHub Actions despliega automáticamente
- El workflow `.github/workflows/deploy.yml` se ejecuta automáticamente
- Hace pull del código en el VPS
- Reconstruye las imágenes Docker
- Reinicia los servicios

### 4. Verificar en el VPS (opcional)
```bash
ssh root@89.117.33.122
cd /root/unikuo_plataform
docker compose ps
docker compose logs backend | tail -20
```

---

## 🔧 Comandos Útiles

### Local

```bash
# Reconstruir imágenes Docker
docker compose build

# Ver logs en tiempo real
docker compose logs -f

# Detener y eliminar contenedores
docker compose down

# Detener y eliminar contenedores + volúmenes (CUIDADO: borra la BD)
docker compose down -v
```

### VPS

```bash
# Actualizar código manualmente (si GitHub Actions falla)
cd /root/unikuo_plataform
git pull origin main
docker compose build
docker compose up -d

# Ver estado de servicios
docker compose ps

# Ver logs
docker compose logs -f backend
docker compose logs -f database
docker compose logs -f frontend

# Reiniciar un servicio específico
docker compose restart backend
docker compose restart database
docker compose restart frontend
```

---

## ⚠️ Solución de Problemas Rápida

### Local: "Port already in use"
```bash
# Ver qué está usando el puerto
# Windows:
netstat -ano | findstr :3000

# Cambiar puerto en .env o docker-compose.yml
```

### VPS: "Service not running"
```bash
# Ver logs del servicio
docker compose logs backend

# Reiniciar
docker compose restart backend
```

### VPS: "No se reflejan los cambios"
```bash
# Verificar que GitHub Actions se ejecutó
# O hacer pull manual:
cd /root/unikuo_plataform
git pull origin main
docker compose build --no-cache
docker compose up -d
```

---

## 📝 Variables de Entorno

### Local (.env)
```env
NODE_ENV=development
BACKEND_PORT=3000
FRONTEND_PORT=80
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost
ALLOWED_ORIGINS=http://localhost,http://127.0.0.1

DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password
```

### VPS (.env)
```env
NODE_ENV=production
BACKEND_PORT=3001
FRONTEND_PORT=80
API_URL=http://89.117.33.122:3001
FRONTEND_URL=http://89.117.33.122
ALLOWED_ORIGINS=http://89.117.33.122

DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password_seguro
```

**Nota:** El `.env` del VPS NO debe tener `DB_PORT` definido (o debe estar comentado) para que use el puerto 5433 del host.
