# 🔍 Diagnosticar Problema de Base de Datos

## Paso 1: Verificar Estado de Servicios

```bash
docker compose ps
```

Esto te mostrará qué servicios están corriendo y cuáles no.

## Paso 2: Ver Logs de la Base de Datos

```bash
docker compose logs database | tail -50
```

Busca errores relacionados con:
- Autenticación
- Permisos
- Inicialización

## Paso 3: Intentar Iniciar la Base de Datos

```bash
docker compose up -d database
```

Espera unos segundos y luego verifica:

```bash
docker compose ps
```

## Paso 4: Si la Base de Datos No Inicia - Recrear

Si la base de datos tiene problemas de credenciales o inicialización, necesitas recrearla:

```bash
# CUIDADO: Esto borra todos los datos
docker compose down database
docker volume rm unikuo_plataform_postgres-data

# Verificar que .env tenga las credenciales correctas
cat .env | grep DB_

# Iniciar de nuevo
docker compose up -d database

# Esperar unos segundos y verificar logs
docker compose logs database | tail -20
```

## Paso 5: Verificar Credenciales en .env

Asegúrate de que tu `.env` tenga:

```env
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password_seguro
```

**⚠️ IMPORTANTE**: El `DB_PASSWORD` debe ser el mismo que se usará cuando se cree el contenedor.

## Paso 6: Una Vez que la Base de Datos Esté Corriendo

```bash
# Reconstruir backend con el código actualizado (timeout aumentado)
git pull origin main
docker compose build backend

# Reiniciar todos los servicios
docker compose restart
```
