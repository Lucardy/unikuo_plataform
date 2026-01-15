# 🚀 Ejecutar Migraciones en el VPS

## Pasos

```bash
# 1. Conectarse al VPS
ssh root@89.117.33.122

# 2. Ir al proyecto
cd /root/unikuo_plataform

# 3. Ejecutar migraciones
docker compose exec backend npm run migrate
```

Esto creará automáticamente:
- ✅ Tabla `roles`
- ✅ Tabla `users`
- ✅ Tabla `user_roles`
- ✅ Roles iniciales (admin, user, store_owner)
- ✅ Tabla `migrations` (para trackear migraciones ejecutadas)

## Verificar

Después de ejecutar, verifica en Adminer (http://89.117.33.122:8080) que existan las tablas.
