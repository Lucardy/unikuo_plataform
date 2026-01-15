# 🧪 Guía Rápida: Probar Localmente

## Opción 1: Sin Docker (Más Rápido para Empezar)

### Paso 1: Instalar Dependencias

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
```

### Paso 2: Configurar Variables de Entorno

**Backend** - Crear `backend/.env`:
```env
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Frontend** - Crear `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:3000
```

### Paso 3: Iniciar los Servicios

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Paso 4: Probar

1. Abre tu navegador en: `http://localhost:5173`
2. Haz clic en "Probar Conexión"
3. Deberías ver un mensaje de éxito ✅

---

## Opción 2: Con Docker (Requiere Instalación)

### Paso 1: Instalar Docker Desktop

1. Descarga Docker Desktop para Windows:
   - https://www.docker.com/products/docker-desktop/
   - O busca "Docker Desktop Windows" en Google

2. Instala Docker Desktop:
   - Ejecuta el instalador
   - Reinicia tu computadora si te lo pide
   - Abre Docker Desktop y espera a que inicie

3. Verifica la instalación:
```powershell
docker --version
docker-compose --version
```

### Paso 2: Configurar Variables de Entorno

En la raíz del proyecto, crea `.env`:

```powershell
cd "C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform"
copy .env.example .env
```

Edita `.env` con un editor de texto (Notepad, VS Code, etc.):

```env
NODE_ENV=development
BACKEND_PORT=3000
FRONTEND_PORT=80
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost
ALLOWED_ORIGINS=http://localhost,http://127.0.0.1
```

### Paso 3: Construir las Imágenes

```powershell
docker-compose build
```

Esto puede tardar varios minutos la primera vez (descarga imágenes base).

### Paso 4: Iniciar los Servicios

```powershell
docker-compose up
```

O para ejecutar en segundo plano:

```powershell
docker-compose up -d
```

### Paso 5: Verificar que Funciona

1. Abre tu navegador en: `http://localhost`
2. Haz clic en "Probar Conexión"
3. Deberías ver un mensaje de éxito ✅

### Ver Logs

```powershell
# Ver todos los logs
docker-compose logs -f

# Ver solo backend
docker-compose logs -f backend

# Ver solo frontend
docker-compose logs -f frontend
```

### Detener los Servicios

```powershell
# Detener (Ctrl+C si está en primer plano)
# O si está en segundo plano:
docker-compose down
```

---

## 🐛 Solución de Problemas

### Error: "docker no se reconoce"

- Docker Desktop no está instalado o no está corriendo
- Abre Docker Desktop y espera a que inicie completamente
- Verifica que esté corriendo en la bandeja del sistema (icono de Docker)

### Error: "port already in use"

Alguien está usando el puerto. Soluciones:

1. **Cambiar el puerto en `.env`:**
```env
FRONTEND_PORT=8080  # En vez de 80
```

2. **O cerrar lo que está usando el puerto:**
```powershell
# Ver qué está usando el puerto 80
netstat -ano | findstr :80

# Ver qué está usando el puerto 3000
netstat -ano | findstr :3000
```

### El frontend no se conecta al backend

1. Verifica que ambos contenedores estén corriendo:
```powershell
docker-compose ps
```

2. Verifica las variables de entorno en `.env`

3. Revisa los logs:
```powershell
docker-compose logs backend
docker-compose logs frontend
```

### Reconstruir desde cero

```powershell
# Detener y eliminar todo
docker-compose down -v

# Reconstruir sin cache
docker-compose build --no-cache

# Iniciar de nuevo
docker-compose up -d
```

---

## 💡 Recomendación

**Para empezar rápido:** Usa la Opción 1 (sin Docker)
- Más rápido
- No requiere instalación
- Fácil de debuggear
- Perfecto para desarrollo

**Para producción/VPS:** Usa Docker
- Consistencia entre entornos
- Más fácil de desplegar
- Mejor para escalar
