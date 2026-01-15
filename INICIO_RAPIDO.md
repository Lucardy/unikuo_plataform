# ⚡ Inicio Rápido - Docker Local

## 🚀 Probar Docker Localmente (Ahora)

### Paso 1: Crear archivo `.env`

En la raíz del proyecto (`unikuo_plataform/`), crea un archivo llamado `.env` con este contenido:

```env
NODE_ENV=development
BACKEND_PORT=3000
FRONTEND_PORT=80
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost
ALLOWED_ORIGINS=http://localhost,http://127.0.0.1
```

**Cómo crearlo:**
- Abre VS Code o cualquier editor
- Crea nuevo archivo llamado `.env` en la raíz del proyecto
- Pega el contenido de arriba
- Guarda

### Paso 2: Construir las imágenes

Abre PowerShell en la carpeta del proyecto:

```powershell
cd "C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform"
docker-compose build
```

⏱️ **Esto puede tardar 5-10 minutos la primera vez** (descarga imágenes base de Node.js y Nginx)

### Paso 3: Iniciar los servicios

```powershell
docker-compose up
```

O si quieres que corra en segundo plano:

```powershell
docker-compose up -d
```

### Paso 4: Probar

1. Abre tu navegador en: **http://localhost**
2. Deberías ver la aplicación
3. Haz clic en "Probar Conexión"
4. Deberías ver un mensaje de éxito ✅

### Ver logs

```powershell
# Ver todos los logs
docker-compose logs -f

# Ver solo backend
docker-compose logs -f backend

# Ver solo frontend
docker-compose logs -f frontend
```

### Detener

```powershell
# Si está en primer plano: presiona Ctrl+C
# Si está en segundo plano:
docker-compose down
```

---

## 📤 Cuando Pushees al VPS

### En el VPS, después de hacer `git pull`:

1. **Crear `.env` en el VPS** (con valores de producción):

```bash
cd /root/unikuo_plataform
nano .env
```

Pega esto (ajusta con tu IP):
```env
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=80
API_URL=http://89.117.33.122:3000
FRONTEND_URL=http://89.117.33.122
ALLOWED_ORIGINS=http://89.117.33.122
```

2. **Construir y ejecutar:**

```bash
docker-compose build
docker-compose up -d
```

3. **Verificar:**

```bash
docker-compose ps
```

4. **Probar:** Abre `http://89.117.33.122` en tu navegador

---

## ✅ Resumen

**Local (Windows):**
- ✅ Crear `.env` con valores de desarrollo
- ✅ `docker-compose build`
- ✅ `docker-compose up`
- ✅ Probar en `http://localhost`

**VPS:**
- ✅ `git pull`
- ✅ Crear `.env` con valores de producción
- ✅ `docker-compose build`
- ✅ `docker-compose up -d`
- ✅ Probar en `http://TU_IP`

**¡Todo funcionará automáticamente!** 🎉

---

## 🐛 Si algo falla

Ver la guía completa en `FLUJO_TRABAJO.md`
