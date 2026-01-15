# 🧪 Probar la Aplicación en el VPS

Guía rápida para verificar que todo funciona correctamente en el VPS.

## ✅ Paso 1: Verificar que los Servicios Están Corriendo

Conéctate al VPS:

```bash
ssh root@89.117.33.122
```

Verifica el estado de los servicios:

```bash
cd /root/unikuo_plataform
docker-compose ps
```

**Deberías ver algo como:**
```
NAME              STATUS
unikuo-backend    Up X seconds (healthy)
unikuo-frontend   Up X seconds
```

## 🌐 Paso 2: Probar en el Navegador

Abre tu navegador y ve a:

**http://89.117.33.122**

O si tienes dominio configurado:
**http://tu-dominio.com**

### ¿Qué deberías ver?

1. La página "Unikuo Platform" con el título
2. Un componente de "Prueba de Conexión"
3. Botones para probar la conexión

## 🔍 Paso 3: Probar la Conexión Frontend-Backend

1. En la página web, haz clic en **"Probar Conexión"**
2. Deberías ver un mensaje de éxito ✅ con datos del backend
3. También puedes probar **"Health Check"**

## 📋 Paso 4: Verificar Logs (Si Algo No Funciona)

### Ver logs de todos los servicios:

```bash
cd /root/unikuo_plataform
docker-compose logs -f
```

### Ver solo backend:

```bash
docker-compose logs -f backend
```

### Ver solo frontend:

```bash
docker-compose logs -f frontend
```

## 🧪 Paso 5: Probar el API Directamente

Puedes probar el backend directamente desde tu navegador o con curl:

```bash
# Desde tu computadora
curl http://89.117.33.122:3000/api/test

# O desde el VPS
curl http://localhost:3000/api/test
```

**Deberías ver:**
```json
{
  "success": true,
  "message": "¡Conexión exitosa con el backend!",
  ...
}
```

## 🔧 Verificación Completa

### Checklist:

- [ ] `docker-compose ps` muestra ambos servicios como "Up"
- [ ] Puedo acceder a `http://89.117.33.122` en el navegador
- [ ] Veo la página de "Unikuo Platform"
- [ ] El botón "Probar Conexión" funciona
- [ ] Veo un mensaje de éxito ✅
- [ ] El health check funciona
- [ ] No hay errores en los logs

## 🐛 Si Algo No Funciona

### El frontend no carga

```bash
# Verificar que el frontend está corriendo
docker-compose ps frontend

# Ver logs del frontend
docker-compose logs frontend

# Reiniciar frontend
docker-compose restart frontend
```

### El backend no responde

```bash
# Verificar que el backend está corriendo
docker-compose ps backend

# Ver logs del backend
docker-compose logs backend

# Verificar health check
docker-compose exec backend wget -qO- http://localhost:3000/api/test/health

# Reiniciar backend
docker-compose restart backend
```

### Error de conexión desde el navegador

1. **Verificar firewall:**
```bash
sudo ufw status
# Debe permitir puerto 80
```

2. **Verificar que los puertos están abiertos:**
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
```

3. **Verificar variables de entorno:**
```bash
cd /root/unikuo_plataform
cat .env
# Verificar que API_URL y FRONTEND_URL estén correctos
```

### Error de CORS

Si ves errores de CORS en la consola del navegador:

```bash
# Verificar ALLOWED_ORIGINS en .env
cat .env | grep ALLOWED_ORIGINS

# Debe incluir: http://89.117.33.122
# Si no, editar:
nano .env
# Agregar: ALLOWED_ORIGINS=http://89.117.33.122
# Guardar y reiniciar:
docker-compose restart backend
```

## 🔄 Reiniciar Todo

Si necesitas reiniciar todo desde cero:

```bash
cd /root/unikuo_plataform

# Detener todo
docker-compose down

# Reconstruir
docker-compose build

# Iniciar
docker-compose up -d

# Verificar
docker-compose ps
```

## 📊 Comandos Útiles

```bash
# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver uso de recursos
docker stats

# Reiniciar un servicio específico
docker-compose restart backend
docker-compose restart frontend

# Ver información detallada
docker-compose config
```

## ✅ Todo Funciona Correctamente Si:

1. ✅ Puedes acceder a `http://89.117.33.122` en el navegador
2. ✅ Ves la página de "Unikuo Platform"
3. ✅ El botón "Probar Conexión" muestra éxito ✅
4. ✅ No hay errores en la consola del navegador (F12)
5. ✅ Los logs no muestran errores críticos

---

## 🎉 ¡Listo!

Si todo funciona, tu aplicación está desplegada y funcionando correctamente en el VPS.
