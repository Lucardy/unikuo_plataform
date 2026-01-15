# 🔌 Configurar para Usar BD del VPS desde Local

## 🎯 Objetivo

Trabajar directamente con la base de datos del VPS desde tu máquina local. Así todos los cambios se reflejan en la BD real sin necesidad de migraciones.

## ✅ Pasos Sencillos

### Paso 1: Crear archivo `.env.local`

En la **raíz del proyecto**, crea un archivo llamado `.env.local`:

```env
# Base de datos del VPS
DB_HOST=89.117.33.122
DB_PORT=5433
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=tu_password_del_vps
```

**Importante:** 
- Reemplaza `tu_password_del_vps` con la contraseña real que tienes en el VPS
- Este archivo NO se sube a Git (está en .gitignore)

### Paso 2: Verificar que el VPS tenga el puerto abierto

En el VPS, verifica que el puerto 5433 esté expuesto. Ya debería estar configurado en `docker-compose.yml`:

```bash
# En el VPS
docker compose ps
# Deberías ver que el puerto 5433 está mapeado
```

### Paso 3: Reiniciar Docker local

```bash
# Detener todo
docker compose -f docker-compose.dev.yml down

# Volver a iniciar (ahora usará .env.local y se conectará al VPS)
docker compose -f docker-compose.dev.yml up -d
```

### Paso 4: Verificar que funciona

```bash
# Ver logs del backend
docker compose -f docker-compose.dev.yml logs backend --tail=20
```

Deberías ver que se conecta correctamente al VPS.

O prueba desde el navegador:
- Abre: http://localhost:3000/api/test/health
- Debería responder correctamente

## 🎮 Uso Diario

### Crear/Modificar Tablas

Ahora puedes crear tablas directamente desde **Adminer**:

1. Abre: http://localhost:8080
2. Sistema: **PostgreSQL**
3. Servidor: `89.117.33.122:5433` (IP del VPS)
4. Usuario: `unikuo_user`
5. Contraseña: (la del VPS)
6. Base de datos: `unikuo_plataform`

**¡Listo!** Ahora cualquier cambio que hagas se refleja directamente en la BD del VPS.

### Desde el Código

Cualquier cambio que hagas en el backend se conecta automáticamente a la BD del VPS. No necesitas hacer nada especial.

## 🔄 Volver a BD Local

Si quieres volver a usar BD local:

1. **Renombrar o eliminar `.env.local`:**
   ```bash
   # Renombrar (para guardarlo por si acaso)
   mv .env.local .env.local.backup
   ```

2. **Reiniciar Docker:**
   ```bash
   docker compose -f docker-compose.dev.yml down
   docker compose -f docker-compose.dev.yml up -d
   ```

Ahora volverá a usar la BD local.

## ⚠️ Advertencias

1. **Trabajas con datos reales**: Ten cuidado con los cambios
2. **Dependes de internet**: Si se cae, no puedes trabajar
3. **Puede ser más lento**: Hay latencia de red
4. **No puedes experimentar libremente**: Cualquier error afecta producción

## 💡 Recomendación

**Para ahora (desarrollo inicial):**
- ✅ Usa BD del VPS (más simple, como quieres)
- ✅ Trabaja con cuidado
- ✅ Haz backups antes de cambios grandes

**Para más adelante (cuando esté más estable):**
- ✅ Vuelve a BD local + migraciones
- ✅ Más seguro y rápido
- ✅ Puedes experimentar sin miedo

## 🆘 Solución de Problemas

### Error: "Connection refused"

- Verifica que el VPS tenga el puerto 5433 abierto
- Verifica que Docker en el VPS esté corriendo: `docker compose ps` en el VPS
- Verifica el firewall del VPS

### Error: "Password authentication failed"

- Verifica la contraseña en `.env.local`
- Debe ser la misma que en el VPS

### Muy lento

- Es normal, hay latencia de red
- Considera volver a BD local si es muy molesto
