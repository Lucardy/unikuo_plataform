# 🔄 Actualizar VPS con Nuevas Funcionalidades

## 📋 Situación Actual

Cuando haces `git push` y se actualiza el código en el VPS, **NO se actualizan automáticamente**:
- ❌ El frontend compilado (necesita rebuild)
- ❌ La base de datos (las tablas nuevas no se crean automáticamente)

## 🚀 Pasos para Actualizar el VPS

### 1. Conectarse al VPS

```bash
ssh root@89.117.33.122
```

### 2. Ir al directorio del proyecto

```bash
cd /root/unikuo_plataform
```

### 3. Actualizar el código (si no se hizo automáticamente)

```bash
git pull origin main
```

### 4. Reconstruir el Frontend

El frontend necesita recompilarse para incluir los nuevos componentes:

```bash
docker compose build frontend
```

### 5. Actualizar la Base de Datos

**Opción A: Usar Migraciones (RECOMENDADO)** ✅

Si agregaste nuevas tablas o modificaste la estructura, ejecuta las migraciones:

```bash
# Ejecutar migraciones pendientes
docker compose exec backend npm run migrate
```

Esto ejecutará automáticamente todas las migraciones nuevas que hayas creado en `database/migrations/`.

**Opción B: Recrear Base de Datos (SOLO si es primera vez o no importa perder datos)** ⚠️

**⚠️ ADVERTENCIA:** Esto eliminará todos los datos existentes en la base de datos del VPS.

Si es la primera vez que despliegas o no te importa perder datos:

```bash
# Detener los contenedores
docker compose down

# Eliminar el volumen de la base de datos (esto borra todos los datos)
docker volume rm unikuo_plataform_postgres-data

# Volver a iniciar (esto ejecutará init.sql automáticamente)
docker compose up -d

# Ejecutar migraciones iniciales
docker compose exec backend npm run migrate
```

### 6. Verificar que todo funciona

```bash
# Ver el estado de los contenedores
docker compose ps

# Ver los logs del backend
docker compose logs backend --tail=50

# Ver los logs del frontend
docker compose logs frontend --tail=50
```

### 7. Probar en el navegador

Abre: `http://89.117.33.122`

Deberías ver la pantalla de Login/Registro.

## 🔍 Verificar Base de Datos

Para verificar que las tablas se crearon correctamente:

```bash
# Conectarse a Adminer
# Abre: http://89.117.33.122:8080
# Usuario: unikuo_user
# Contraseña: (la que tengas en .env)
# Base de datos: unikuo_plataform
# Servidor: database
```

O desde la línea de comandos:

```bash
docker compose exec database psql -U unikuo_user -d unikuo_plataform -c "\dt"
```

Deberías ver las tablas: `roles`, `users`, `user_roles`, etc.

## 📝 Notas Importantes

### Bases de Datos Separadas

- **Local**: Base de datos en `unikuo_plataform_postgres-data-dev`
- **VPS**: Base de datos en `unikuo_plataform_postgres-data`

Son **completamente independientes**. Los datos que creas localmente NO aparecen en el VPS y viceversa.

### Cuándo Recrear la Base de Datos

Solo necesitas recrear la base de datos cuando:
- ✅ Agregas nuevas tablas en `init.sql`
- ✅ Cambias la estructura de tablas existentes
- ✅ Es la primera vez que despliegas

**NO necesitas recrear** cuando:
- ❌ Solo cambias el código del backend/frontend
- ❌ Solo agregas/modificas datos (no estructura)

### Alternativa: Migraciones Manuales

Si ya tienes datos importantes en el VPS y no quieres borrarlos, puedes ejecutar el SQL manualmente:

```bash
docker compose exec database psql -U unikuo_user -d unikuo_plataform -f /docker-entrypoint-initdb.d/init.sql
```

Pero esto puede fallar si las tablas ya existen. Mejor usar migraciones SQL específicas.

## 🔄 Flujo Completo de Actualización

```bash
# 1. En tu máquina local
git add .
git commit -m "Agregar nueva funcionalidad"
git push origin main

# 2. En el VPS (se ejecuta automáticamente si tienes GitHub Actions)
cd /root/unikuo_plataform
git pull origin main

# 3. Reconstruir frontend (si cambió el código del frontend)
docker compose build frontend
docker compose up -d frontend

# 4. Ejecutar migraciones de base de datos (si agregaste/modificaste tablas)
docker compose exec backend npm run migrate

# 5. Verificar
docker compose ps
docker compose logs backend --tail=20
```

## 📚 Más Información

Para más detalles sobre cómo crear y usar migraciones, consulta:
- **`MIGRACIONES_BASE_DATOS.md`** - Guía completa del sistema de migraciones
