# 🔌 Conectar Base de Datos Local al VPS (⚠️ SOLO LECTURA)

## ⚠️ ADVERTENCIA IMPORTANTE

**NUNCA uses esta configuración para desarrollo activo en producción.**

Esta opción es útil SOLO para:
- ✅ Consultar datos reales
- ✅ Verificar que algo funciona con datos reales
- ✅ Debugging específico

**NO uses esto para:**
- ❌ Desarrollo normal
- ❌ Pruebas de código
- ❌ Experimentos

## 🔧 Configuración Temporal

### Paso 1: Crear archivo `.env.local` (NO se sube a Git)

En la raíz del proyecto, crea `.env.local`:

```env
# ⚠️ CONFIGURACIÓN TEMPORAL PARA CONECTAR AL VPS
# Este archivo NO se sube a Git (.gitignore)

# Base de datos del VPS (solo lectura recomendado)
DB_HOST=89.117.33.122
DB_PORT=5433
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=tu_password_del_vps

# Backend local sigue usando BD local
# Solo los scripts de migración/backup usarán esta conexión
```

### Paso 2: Modificar scripts para usar .env.local

Los scripts ya están configurados para leer `.env.local` si existe.

### Paso 3: Usar con precaución

```bash
# Hacer backup del VPS (conecta al VPS)
DB_HOST=89.117.33.122 npm run backup

# Ver migraciones del VPS (solo lectura)
DB_HOST=89.117.33.122 npm run migrate
```

## 🛡️ Mejor Alternativa: Usar pg_dump

En lugar de conectar directamente, es más seguro hacer un dump:

```bash
# Desde tu máquina local (si tienes acceso SSH)
ssh root@89.117.33.122 "docker compose exec -T database pg_dump -U unikuo_user unikuo_plataform" > backup_vps.sql

# Importar en local (opcional)
docker compose -f docker-compose.dev.yml exec -T database psql -U unikuo_user -d unikuo_plataform < backup_vps.sql
```

## 📋 Recomendación Final

**Para desarrollo normal:**
- ✅ Usa BD local
- ✅ Trabaja sin miedo
- ✅ Experimenta libremente

**Para verificar con datos reales:**
- ✅ Haz un dump del VPS
- ✅ Importa en local temporalmente
- ✅ Prueba
- ✅ Elimina el dump después

**Para producción:**
- ✅ Migraciones probadas localmente
- ✅ Backup antes de migrar
- ✅ Migraciones seguras (solo agregan/modifican)
