# 🔄 Activar BD del VPS en el Backend

## Pasos

### 1. Verificar que `.env.local` existe y tiene los datos correctos

En la raíz del proyecto, verifica que `.env.local` tenga:

```env
DB_HOST=89.117.33.122
DB_PORT=5433
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=tu_password_del_vps
```

### 2. Reiniciar el backend

```bash
# Detener y volver a iniciar
docker compose -f docker-compose.dev.yml restart backend

# O detener todo y volver a iniciar
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d
```

### 3. Verificar que está usando el VPS

```bash
# Ver logs del backend
docker compose -f docker-compose.dev.yml logs backend --tail=20
```

Deberías ver que se conecta a `89.117.33.122:5433` en lugar de `database`.

### 4. Probar login

Intenta loguearte con un usuario que exista en el VPS (no en local).
