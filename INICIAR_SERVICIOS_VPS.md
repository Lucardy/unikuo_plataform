# 🚀 Iniciar Servicios en el VPS

## Problema Detectado

Tienes Docker Compose v5.0.1 (versión nueva) que usa `docker compose` (con espacio), pero los servicios nunca se iniciaron.

## ✅ Solución Rápida

Ejecuta estos comandos en el VPS:

### Paso 1: Verificar que existe .env

```bash
cd /root/unikuo_plataform
ls -la .env
```

Si NO existe, créalo:

```bash
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

Guarda: `Ctrl+O`, `Enter`, `Ctrl+X`

### Paso 2: Iniciar los Servicios

```bash
# Usar docker compose (con espacio) - versión nueva
docker compose up -d
```

### Paso 3: Verificar que Están Corriendo

```bash
# Ver estado
docker compose ps

# Ver logs
docker compose logs -f
```

### Paso 4: Probar en el Navegador

Abre: **http://89.117.33.122**

---

## 🔧 Si Algo No Funciona

### Ver logs de errores:

```bash
docker compose logs
```

### Reiniciar todo:

```bash
docker compose down
docker compose build
docker compose up -d
```

### Verificar puertos:

```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
```

### Verificar firewall:

```bash
sudo ufw status
# Si el puerto 80 no está abierto:
sudo ufw allow 80/tcp
```

---

## ✅ Comandos Correctos para tu VPS

**Recuerda:** Usa `docker compose` (con espacio), NO `docker-compose` (con guión)

```bash
# Ver estado
docker compose ps

# Ver logs
docker compose logs -f

# Iniciar
docker compose up -d

# Detener
docker compose down

# Reconstruir
docker compose build

# Reiniciar
docker compose restart
```
