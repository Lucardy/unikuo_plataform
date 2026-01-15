# 📊 Crear Tablas de Autenticación en el VPS

## 🎯 Objetivo

Agregar las tablas de autenticación (roles, users, user_roles) a la BD del VPS.

## ✅ Pasos

### Opción 1: Usar Migraciones (Recomendado)

```bash
# En el VPS
ssh root@89.117.33.122
cd /root/unikuo_plataform

# Ejecutar migraciones
docker compose exec backend npm run migrate
```

Esto ejecutará automáticamente `001_initial_schema.sql` que contiene todas las tablas.

### Opción 2: Ejecutar SQL Manualmente

Si prefieres hacerlo manualmente desde Adminer:

1. Abre: http://89.117.33.122:8080
2. Conéctate a la BD
3. Ve a "SQL command"
4. Copia y pega el contenido de `database/migrations/001_initial_schema.sql`
5. Ejecuta

### Opción 3: Desde Terminal del VPS

```bash
# En el VPS
cd /root/unikuo_plataform

# Ejecutar el SQL directamente
docker compose exec database psql -U unikuo_user -d unikuo_plataform -f /docker-entrypoint-initdb.d/init.sql
```

Pero esto puede fallar si las tablas ya existen. Mejor usar migraciones.

## 🔍 Verificar

Después de ejecutar, verifica en Adminer que existan las tablas:
- `roles`
- `users`
- `user_roles`
- `migrations`
