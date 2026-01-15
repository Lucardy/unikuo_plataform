# 🔌 Usar Base de Datos del VPS desde Local

## 🎯 Objetivo

Trabajar directamente con la base de datos del VPS desde tu máquina local. Así todos los cambios se reflejan en la BD real sin necesidad de migraciones.

## ⚠️ ADVERTENCIA

- ✅ Útil para desarrollo y pruebas
- ⚠️ Trabajas con datos reales (ten cuidado)
- ⚠️ Dependes de internet
- ⚠️ Puede ser más lento que BD local

## 🔧 Configuración

### Paso 1: Verificar que el VPS tenga el puerto abierto

El VPS debe tener el puerto `5433` expuesto. Ya está configurado en `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Puerto 5433 en el host, 5432 en el contenedor
```

### Paso 2: Crear archivo `.env.local`

En la **raíz del proyecto**, crea un archivo `.env.local` (este archivo NO se sube a Git):

```env
# ⚠️ CONFIGURACIÓN PARA USAR BD DEL VPS DESDE LOCAL
# Este archivo sobrescribe .env solo en tu máquina local

# Base de datos del VPS (en lugar de BD local)
DB_HOST=89.117.33.122
DB_PORT=5433
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=tu_password_del_vps

# El resto de variables las toma de .env
```

**Importante:** Reemplaza `tu_password_del_vps` con la contraseña real que tienes en el VPS.

### Paso 3: Modificar docker-compose.dev.yml

Necesitamos que el backend se conecte al VPS en lugar de la BD local. Hay dos opciones:

#### Opción A: Desactivar BD local (Recomendado)

Comenta o elimina el servicio `database` del `docker-compose.dev.yml` y quita la dependencia:

```yaml
services:
  backend:
    # ... resto de configuración ...
    # depends_on:
    #   database:  # ← Comentar esta línea
    #     condition: service_healthy
```

Y comenta el servicio database completo.

#### Opción B: Mantener BD local pero no usarla

Solo cambia las variables de entorno en `.env.local` y el backend se conectará al VPS automáticamente.

### Paso 4: Reiniciar Docker

```bash
# Detener todo
docker compose -f docker-compose.dev.yml down

# Volver a iniciar (ahora usará .env.local)
docker compose -f docker-compose.dev.yml up -d
```

### Paso 5: Verificar conexión

```bash
# Ver logs del backend
docker compose -f docker-compose.dev.yml logs backend --tail=20
```

Deberías ver que se conecta correctamente.

## 🎮 Uso Diario

### Trabajar Normalmente

Ahora cuando trabajes localmente:

1. **Crear tablas directamente desde Adminer:**
   - Abre: http://localhost:8080
   - Conéctate al servidor: `89.117.33.122:5433`
   - Crea/modifica tablas directamente

2. **O desde código:**
   - Cualquier cambio que hagas en el backend se refleja en la BD del VPS
   - No necesitas migraciones

3. **Ver cambios en tiempo real:**
   - Los cambios se ven inmediatamente
   - Tanto en local como en el VPS (misma BD)

### Volver a BD Local

Si quieres volver a usar BD local:

1. **Renombrar o eliminar `.env.local`:**
   ```bash
   mv .env.local .env.local.backup
   ```

2. **Reiniciar Docker:**
   ```bash
   docker compose -f docker-compose.dev.yml down
   docker compose -f docker-compose.dev.yml up -d
   ```

## 🔍 Verificar que Funciona

### Desde Adminer Local

1. Abre: http://localhost:8080
2. Sistema: PostgreSQL
3. Servidor: `89.117.33.122:5433` (IP del VPS)
4. Usuario: `unikuo_user`
5. Contraseña: (la del VPS)
6. Base de datos: `unikuo_plataform`

### Desde Terminal

```bash
# Probar conexión
docker compose -f docker-compose.dev.yml exec backend node -e "
import('./src/config/database.js').then(db => {
  db.testConnection().then(r => console.log(r));
});
"
```

## ⚡ Ventajas de Este Enfoque

1. ✅ **Una sola BD**: No necesitas sincronizar
2. ✅ **Cambios inmediatos**: Se ven al instante
3. ✅ **Datos reales**: Trabajas con datos de producción
4. ✅ **Sin migraciones**: Creas tablas directamente

## ⚠️ Desventajas

1. ❌ **Dependes de internet**: Si se cae, no puedes trabajar
2. ❌ **Más lento**: Latencia de red
3. ❌ **Riesgo**: Puedes romper datos reales
4. ❌ **No puedes experimentar libremente**: Cualquier error afecta producción

## 💡 Recomendación

**Para ahora (desarrollo inicial):**
- ✅ Usa BD del VPS (más simple)
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

### Error: "Password authentication failed"

- Verifica la contraseña en `.env.local`
- Debe ser la misma que en el VPS

### Muy lento

- Es normal, hay latencia de red
- Considera volver a BD local si es muy molesto
