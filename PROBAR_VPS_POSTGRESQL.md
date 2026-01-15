# 🧪 Probar PostgreSQL en el VPS

## ✅ Paso 1: Verificar Despliegue Automático

### Opción A: Verificar en GitHub Actions

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **"Actions"**
3. Deberías ver el workflow "Deploy Unikuo Platform to VPS" ejecutándose o completado
4. Si hay errores, revisa los logs

### Opción B: Verificar Manualmente en el VPS

```bash
# Conectarse al VPS
ssh root@89.117.33.122

# Ir al proyecto
cd /root/unikuo_plataform

# Ver si hay cambios nuevos
git status

# Si hay cambios, hacer pull
git pull origin main
```

## 🔧 Paso 2: Actualizar .env en el VPS

```bash
# Editar .env
nano .env
```

Agrega estas líneas al final (o actualiza si ya existen):

```env
# Base de datos PostgreSQL
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password_seguro_aqui
```

**⚠️ IMPORTANTE**: Cambia `unikuo_password_seguro_aqui` por una contraseña segura.

Guarda: `Ctrl+O`, `Enter`, `Ctrl+X`

## 🚀 Paso 3: Reconstruir e Iniciar Servicios

```bash
# Detener servicios actuales
docker compose down

# Reconstruir backend (para instalar pg)
docker compose build backend

# Iniciar todos los servicios (incluyendo PostgreSQL)
docker compose up -d

# Verificar que todos estén corriendo
docker compose ps
```

**Deberías ver 3 servicios:**
- `unikuo-backend` - Up (healthy)
- `unikuo-frontend` - Up
- `unikuo-database` - Up (healthy)

## 🧪 Paso 4: Probar en el Navegador

1. Abre: **http://89.117.33.122**
2. Deberías ver la página con **4 botones**
3. Prueba cada botón:
   - ✅ "Probar Conexión" - Debería funcionar
   - ✅ "Health Check" - Debería funcionar
   - ✅ "Probar Base de Datos" - **NUEVO** - Debería mostrar éxito
   - ✅ "Obtener Datos DB" - **NUEVO** - Debería mostrar datos

## 🔍 Paso 5: Verificar Logs (Si Algo No Funciona)

```bash
# Ver logs del backend
docker compose logs backend

# Ver logs de la base de datos
docker compose logs database

# Ver logs del frontend
docker compose logs frontend

# Ver todos los logs
docker compose logs -f
```

## ✅ Checklist de Verificación

- [ ] GitHub Actions completó el despliegue (o hice git pull manual)
- [ ] `.env` actualizado con variables de PostgreSQL
- [ ] `docker compose ps` muestra 3 servicios corriendo
- [ ] Puedo acceder a `http://89.117.33.122` en el navegador
- [ ] Veo los 4 botones en la página
- [ ] "Probar Base de Datos" funciona ✅
- [ ] "Obtener Datos DB" funciona ✅

## 🐛 Solución de Problemas

### El despliegue automático falló

```bash
# Hacer pull manual
cd /root/unikuo_plataform
git pull origin main

# Reconstruir e iniciar manualmente
docker compose build
docker compose up -d
```

### La base de datos no inicia

```bash
# Ver logs de la base de datos
docker compose logs database

# Verificar que el volumen se creó
docker volume ls | grep postgres

# Si hay problemas, eliminar volumen y recrear (CUIDADO: borra datos)
docker compose down -v
docker compose up -d
```

### El backend no se conecta a la base de datos

1. Verifica que las variables en `.env` sean correctas
2. Verifica que la base de datos esté saludable: `docker compose ps`
3. Verifica los logs: `docker compose logs backend`

### Los botones nuevos no aparecen

```bash
# Reconstruir frontend
docker compose build frontend
docker compose up -d --force-recreate frontend
```

---

## 🎉 ¡Listo!

Si todos los botones funcionan, tu aplicación está completamente desplegada y funcionando en el VPS con PostgreSQL. 🚀
