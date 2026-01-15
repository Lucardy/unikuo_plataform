# ✅ Verificar Conexión en VPS

## Estado Actual

Todos los servicios están corriendo:
- ✅ Backend: puerto 3001 (healthy)
- ✅ Database: puerto 5433 (healthy) 
- ✅ Frontend: puerto 80 (health: starting)

## Pasos para Verificar

### 1. Verificar Logs del Backend

```bash
docker compose logs backend | tail -30
```

Busca errores de conexión a PostgreSQL. Deberías ver mensajes como:
- "Servidor corriendo en http://localhost:3000"
- Si hay errores de conexión, aparecerán aquí

### 2. Actualizar Código (Timeout Aumentado)

El código local tiene el timeout aumentado a 10 segundos. Necesitas hacer pull:

```bash
git pull origin main
docker compose build backend
docker compose restart backend
```

### 3. Probar en el Navegador

Abre en tu navegador:
- **Frontend**: http://89.117.33.122
- **Backend API**: http://89.117.33.122:3001/api/test

### 4. Probar Conexión a Base de Datos

En la página web, haz clic en:
1. "Probar Conexión" (backend)
2. "Probar Base de Datos" (debería funcionar ahora)
3. "Obtener Datos DB" (debería mostrar datos de prueba)

### 5. Si Hay Errores de Conexión

Si el backend aún no puede conectarse, verifica:

```bash
# Ver logs del backend
docker compose logs backend | grep -i postgres

# Probar conexión manual desde el contenedor del backend
docker compose exec backend sh
# Dentro del contenedor:
# wget -qO- http://localhost:3000/api/database/test
# exit
```

---

## Nota sobre el Puerto 5432

Hay otro PostgreSQL corriendo en el puerto 5432 del host (probablemente instalado directamente en el sistema). Esto está bien, porque:
- Tu contenedor Docker usa el puerto 5433 del host
- El backend se conecta internamente al contenedor `database` en el puerto 5432 (interno)
- No hay conflicto
