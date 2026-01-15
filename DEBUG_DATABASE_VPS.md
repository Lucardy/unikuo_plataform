# 🔍 Debug: Error de Conexión a PostgreSQL en VPS

## Pasos para Diagnosticar

### 1. Verificar que los Servicios Están Corriendo

```bash
docker compose ps
```

**Deberías ver 3 servicios:**
- `unikuo-backend` - Up (healthy)
- `unikuo-frontend` - Up
- `unikuo-database` - Up (healthy)

### 2. Ver Logs del Backend

```bash
docker compose logs backend
```

Busca errores relacionados con PostgreSQL o conexión.

### 3. Ver Logs de la Base de Datos

```bash
docker compose logs database
```

### 4. Verificar Variables de Entorno

```bash
# Ver el contenido del .env
cat .env | grep DB_
```

Deberías ver:
```
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=...
```

### 5. Probar Conexión desde el Backend

```bash
# Ejecutar comando dentro del contenedor del backend
docker compose exec backend sh

# Dentro del contenedor, probar conexión
# (Necesitarías tener psql instalado, pero podemos probar de otra forma)
```

### 6. Verificar que la Base de Datos Está Lista

```bash
# Verificar health check de la base de datos
docker compose exec database pg_isready -U unikuo_user -d unikuo_plataform
```

### 7. Verificar Red Docker

```bash
# Verificar que los contenedores están en la misma red
docker network inspect unikuo_plataform_unikuo-network
```

---

## Soluciones Comunes

### Error: "password authentication failed"

**Causa**: Las credenciales en `.env` no coinciden con las del contenedor.

**Solución**: Verifica que `DB_USER` y `DB_PASSWORD` en `.env` coincidan con las del `docker-compose.yml`.

### Error: "connection refused" o "ECONNREFUSED"

**Causa**: La base de datos no está lista o no está accesible.

**Solución**:
```bash
# Verificar que la base de datos está saludable
docker compose ps database

# Si no está healthy, ver logs
docker compose logs database

# Reiniciar la base de datos
docker compose restart database
```

### Error: "database does not exist"

**Causa**: El script de inicialización no se ejecutó.

**Solución**:
```bash
# Eliminar volumen y recrear (CUIDADO: borra datos)
docker compose down -v
docker compose up -d
```

### Error: "host not found" o "getaddrinfo ENOTFOUND"

**Causa**: El backend no puede resolver el nombre `database`.

**Solución**: Verifica que ambos servicios estén en la misma red:
```bash
docker compose ps
# Ambos deben estar en "unikuo_plataform_unikuo-network"
```

---

## Comando Rápido para Ver Todo

```bash
# Ver estado
docker compose ps

# Ver logs del backend (últimas 50 líneas)
docker compose logs --tail=50 backend

# Ver logs de la base de datos
docker compose logs --tail=50 database

# Verificar variables de entorno
cat .env
```
