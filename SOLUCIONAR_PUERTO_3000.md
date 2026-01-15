# 🔧 Solucionar Puerto 3000 en Uso

## Problema

El error dice: `failed to bind host port 0.0.0.0:3000/tcp: address already in use`

Esto significa que otro proceso está usando el puerto 3000.

## ✅ Solución

### Paso 1: Ver qué está usando el puerto 3000

En el VPS, ejecuta:

```bash
sudo netstat -tlnp | grep :3000
```

O también:

```bash
sudo lsof -i :3000
```

### Paso 2: Detener el proceso que está usando el puerto

Si es otro contenedor Docker:

```bash
# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Si hay algún contenedor usando el puerto, detenerlo:
docker stop NOMBRE_DEL_CONTENEDOR
docker rm NOMBRE_DEL_CONTENEDOR
```

Si es un proceso de Node.js directo:

```bash
# Encontrar el proceso
ps aux | grep node

# Matar el proceso (reemplaza PID con el número que veas)
kill -9 PID
```

### Paso 3: Limpiar contenedores huérfanos

```bash
# Detener y eliminar todos los contenedores de docker compose
docker compose down

# Ver si hay contenedores huérfanos
docker ps -a

# Eliminar contenedores que no se están usando
docker container prune -f
```

### Paso 4: Intentar de nuevo

```bash
docker compose up -d
```

### Paso 5: Verificar

```bash
docker compose ps
```

---

## Alternativa: Cambiar el Puerto

Si no puedes detener el proceso que usa el puerto 3000, puedes cambiar el puerto del backend:

1. Editar `.env`:
```bash
nano .env
```

Cambiar:
```env
BACKEND_PORT=3001  # En vez de 3000
API_URL=http://89.117.33.122:3001
```

2. Reiniciar:
```bash
docker compose down
docker compose up -d
```

Pero esto requeriría actualizar también el frontend para que apunte al nuevo puerto.

---

## Solución Rápida Recomendada

```bash
# 1. Detener todo
docker compose down

# 2. Ver qué está usando el puerto
sudo netstat -tlnp | grep :3000

# 3. Si es un proceso, matarlo (reemplaza PID)
# kill -9 PID

# 4. Limpiar contenedores
docker container prune -f

# 5. Iniciar de nuevo
docker compose up -d

# 6. Verificar
docker compose ps
```
