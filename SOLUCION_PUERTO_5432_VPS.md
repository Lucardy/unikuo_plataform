# 🔧 Solución: Puerto 5432 en Uso en VPS

## Problema

El error indica que el puerto 5432 del host está en uso:
```
failed to bind host port 0.0.0.0:5432/tcp: address already in use
```

## Solución

### Paso 1: Verificar qué está usando el puerto 5432

```bash
sudo lsof -i :5432
# O alternativamente:
sudo netstat -tulpn | grep 5432
```

### Paso 2: Editar el .env para NO usar el puerto 5432 del host

El `.env` tiene `DB_PORT=5432`, pero esto se usa para DOS cosas:
1. **Mapeo de puertos del host** (en docker-compose.yml)
2. **Conexión interna del backend** (dentro de Docker)

**Solución**: Elimina `DB_PORT` del `.env` o cámbialo a `5433`:

```bash
nano .env
```

**Opción A - Eliminar DB_PORT** (recomendado):
```env
DB_HOST=database
# DB_PORT=5432  <-- Comentar o eliminar esta línea
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password_seguro
```

**Opción B - Cambiar a 5433**:
```env
DB_HOST=database
DB_PORT=5433  # <-- Cambiar a 5433
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password_seguro
```

**⚠️ IMPORTANTE**: El `DB_PORT` en `.env` es para la conexión INTERNA del backend. El backend siempre debe usar `5432` porque se conecta al contenedor de PostgreSQL que escucha en el puerto 5432 interno.

**Mejor solución**: NO pongas `DB_PORT` en el `.env`. El backend debe usar `5432` (puerto interno), y el mapeo del host será `5433` por defecto.

### Paso 3: Si hay otro PostgreSQL corriendo, detenerlo

Si el comando del Paso 1 muestra otro proceso usando el puerto 5432:

```bash
# Si es otro contenedor Docker:
docker ps | grep 5432
docker stop <container_id>

# Si es PostgreSQL instalado directamente:
sudo systemctl stop postgresql
# O:
sudo service postgresql stop
```

### Paso 4: Iniciar los servicios

```bash
# Asegúrate de que el .env esté correcto (sin DB_PORT o con DB_PORT=5433)
cat .env | grep DB_

# Iniciar servicios
docker compose up -d

# Verificar que todo esté corriendo
docker compose ps
```

---

## Resumen

- **Puerto interno del contenedor**: Siempre `5432` (no cambia)
- **Puerto del host**: `5433` (para evitar conflictos)
- **DB_PORT en .env**: Debe ser `5432` (para conexión interna) o no estar definido
- **Mapeo en docker-compose.yml**: `${DB_PORT:-5433}:5432` (usa 5433 del host si DB_PORT no está definido)
