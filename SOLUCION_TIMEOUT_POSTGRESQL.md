# 🔧 Solución: Timeout de Conexión a PostgreSQL

## Problema Detectado

El error "Connection terminated due to connection timeout" indica que:
1. El timeout es muy corto (2 segundos)
2. O las credenciales no coinciden exactamente

## ✅ Solución

Ya actualicé el código para aumentar el timeout a 10 segundos.

### Paso 1: Verificar Credenciales

En el VPS, verifica que las credenciales en `.env` coincidan EXACTAMENTE con las del `docker-compose.yml`:

```bash
# Ver variables de entorno
cat .env | grep DB_

# Deberías ver:
# DB_HOST=database
# DB_PORT=5432
# DB_NAME=unikuo_plataform
# DB_USER=unikuo_user
# DB_PASSWORD=unikuo_password_seguro
```

**⚠️ IMPORTANTE**: El `DB_PASSWORD` en `.env` debe ser EXACTAMENTE igual al que está en `docker-compose.yml` cuando se creó el contenedor.

### Paso 2: Verificar Logs de la Base de Datos

```bash
docker compose logs database | tail -20
```

Busca errores de autenticación.

### Paso 3: Probar Conexión Manual

```bash
# Probar desde el contenedor de la base de datos
docker compose exec database psql -U unikuo_user -d unikuo_plataform -c "SELECT NOW();"
```

Si esto funciona, el problema es la conexión desde el backend.

### Paso 4: Hacer Pull y Reconstruir

```bash
# Hacer pull del código actualizado (con timeout aumentado)
git pull origin main

# Reconstruir backend
docker compose build backend

# Reiniciar servicios
docker compose restart backend
```

### Paso 5: Si Persiste el Problema - Recrear Base de Datos

Si las credenciales no coinciden, necesitas recrear la base de datos:

```bash
# CUIDADO: Esto borra todos los datos
docker compose down -v

# Editar .env para que las credenciales coincidan exactamente
nano .env
# Asegúrate de que DB_PASSWORD sea exactamente igual a lo que quieres

# Iniciar de nuevo (creará la DB con las nuevas credenciales)
docker compose up -d
```

---

## 🔍 Verificar Credenciales Correctas

El problema más común es que el `DB_PASSWORD` en `.env` no coincide con el que se usó cuando se creó el contenedor.

**Solución**: Usa el mismo password en ambos lugares, o recrea el contenedor con el password correcto.
