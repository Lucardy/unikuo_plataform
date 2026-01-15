# 🔄 Flujo de Trabajo: Local → VPS con Docker

Esta guía explica cómo trabajar localmente y desplegar en el VPS.

## ✅ Respuesta Rápida

**Sí, casi todo funcionará automáticamente**, pero necesitas:

1. ✅ Configurar `.env` localmente (para desarrollo)
2. ✅ Configurar `.env` en el VPS (para producción)
3. ✅ Pushear el código a GitHub
4. ✅ En el VPS: hacer pull y ejecutar `docker-compose up`

---

## 🏠 Paso 1: Probar Localmente (Windows)

### 1.1. Crear archivo `.env` local

En la raíz del proyecto, crea `.env`:

```env
NODE_ENV=development
BACKEND_PORT=3000
FRONTEND_PORT=80
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost
ALLOWED_ORIGINS=http://localhost,http://127.0.0.1
```

### 1.2. Construir y ejecutar

```powershell
# Ir a la carpeta del proyecto
cd "C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform"

# Construir las imágenes (primera vez tarda ~5-10 min)
docker-compose build

# Iniciar los servicios
docker-compose up
```

O en segundo plano:
```powershell
docker-compose up -d
```

### 1.3. Probar

1. Abre: `http://localhost`
2. Haz clic en "Probar Conexión"
3. Deberías ver éxito ✅

### 1.4. Ver logs

```powershell
# Ver todos los logs
docker-compose logs -f

# Ver solo backend
docker-compose logs -f backend

# Ver solo frontend
docker-compose logs -f frontend
```

### 1.5. Detener

```powershell
# Si está en primer plano: Ctrl+C
# Si está en segundo plano:
docker-compose down
```

---

## 📤 Paso 2: Subir a GitHub

### 2.1. Asegúrate de que `.env` NO esté en Git

Verifica que `.gitignore` incluya:
```
.env
```

### 2.2. Commit y Push

```powershell
git add .
git commit -m "Configuración Docker completa"
git push origin main
```

---

## 🚀 Paso 3: Desplegar en VPS

### 3.1. Conectarse al VPS

```powershell
ssh root@89.117.33.122
```

### 3.2. Ir al proyecto

```bash
cd /root/unikuo_plataform
```

### 3.3. Hacer pull del código

```bash
git pull origin main
```

### 3.4. Crear `.env` en el VPS

```bash
# Crear .env desde el ejemplo (si existe)
# O crear manualmente:
nano .env
```

Pega esto (ajusta con tu IP o dominio):

```env
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=80
API_URL=http://89.117.33.122:3000
FRONTEND_URL=http://89.117.33.122
ALLOWED_ORIGINS=http://89.117.33.122,http://tu-dominio.com
```

Guarda: `Ctrl+O`, `Enter`, `Ctrl+X`

### 3.5. Construir y ejecutar en VPS

```bash
# Construir imágenes (primera vez tarda)
docker-compose build

# Iniciar servicios
docker-compose up -d

# Verificar que están corriendo
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 3.6. Probar en el VPS

Abre en tu navegador: `http://89.117.33.122`

---

## 🔄 Flujo de Trabajo Diario

### Cuando haces cambios localmente:

1. **Desarrollar localmente** (con o sin Docker)
2. **Probar localmente**: `docker-compose up`
3. **Commit y push**: `git add . && git commit -m "..." && git push`
4. **En el VPS**: `git pull && docker-compose up -d --build`

### Comando rápido para actualizar VPS:

```bash
# En el VPS, ejecuta esto después de cada git pull:
git pull && docker-compose build && docker-compose up -d
```

---

## 📝 Archivos Importantes

### ✅ Se suben a Git (y funcionan en VPS):
- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- Todo el código fuente
- `.env.example` (plantilla)

### ❌ NO se suben a Git:
- `.env` (contiene configuraciones sensibles)
- `node_modules/`
- `dist/`
- Logs

### ⚠️ Debes crear en cada lugar:
- `.env` local (para desarrollo)
- `.env` en VPS (para producción)

---

## 🔧 Actualizar Código en VPS

Cuando hagas cambios y quieras actualizar el VPS:

```bash
# En el VPS
cd /root/unikuo_plataform

# 1. Obtener últimos cambios
git pull origin main

# 2. Reconstruir imágenes (si hay cambios en Dockerfiles o dependencias)
docker-compose build

# 3. Reiniciar servicios
docker-compose up -d

# 4. Verificar
docker-compose ps
docker-compose logs -f
```

**Script rápido** (crea un alias o script):

```bash
# Crear script de actualización
nano /root/unikuo_plataform/update.sh
```

Pega esto:
```bash
#!/bin/bash
cd /root/unikuo_plataform
git pull origin main
docker-compose build
docker-compose up -d
docker-compose ps
```

Hacer ejecutable:
```bash
chmod +x /root/unikuo_plataform/update.sh
```

Usar:
```bash
/root/unikuo_plataform/update.sh
```

---

## 🐛 Solución de Problemas

### El VPS no se actualiza después de git pull

```bash
# Reconstruir imágenes
docker-compose build --no-cache

# Reiniciar servicios
docker-compose down
docker-compose up -d
```

### Cambios en el código no se reflejan

```bash
# Reconstruir solo el servicio que cambió
docker-compose build --no-cache backend
docker-compose up -d --force-recreate backend
```

### Error de puerto en uso

```bash
# Ver qué está usando el puerto
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000

# Detener servicios Docker
docker-compose down
```

### Ver logs de errores

```bash
# Ver todos los logs
docker-compose logs

# Ver últimos 100 líneas
docker-compose logs --tail=100

# Ver en tiempo real
docker-compose logs -f
```

---

## ✅ Checklist de Despliegue

Antes de pushear a producción:

- [ ] Probé localmente con Docker
- [ ] Todo funciona correctamente
- [ ] `.env` NO está en Git (verificado)
- [ ] Hice commit y push
- [ ] En VPS: hice `git pull`
- [ ] En VPS: creé/actualicé `.env` con valores de producción
- [ ] En VPS: ejecuté `docker-compose build`
- [ ] En VPS: ejecuté `docker-compose up -d`
- [ ] Verifiqué que los servicios están corriendo: `docker-compose ps`
- [ ] Probé en el navegador: `http://TU_IP`

---

## 🎯 Resumen

**Local (Windows):**
1. Crear `.env` con valores de desarrollo
2. `docker-compose build`
3. `docker-compose up`
4. Probar en `http://localhost`

**VPS:**
1. `git pull`
2. Crear/actualizar `.env` con valores de producción
3. `docker-compose build`
4. `docker-compose up -d`
5. Probar en `http://TU_IP`

**¡Eso es todo!** 🎉
