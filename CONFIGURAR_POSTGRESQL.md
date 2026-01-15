# 🐘 Configurar PostgreSQL - Guía Rápida

## ✅ Lo que se ha Configurado

1. ✅ PostgreSQL agregado al `docker-compose.yml`
2. ✅ Script de inicialización (`database/init.sql`)
3. ✅ Configuración de conexión en el backend
4. ✅ Endpoints de prueba (`/api/database/test` y `/api/database/data`)
5. ✅ Componente de prueba en el frontend

## 🚀 Probar Localmente

### Paso 1: Actualizar .env

En la raíz del proyecto, edita `.env` y agrega:

```env
# Base de datos PostgreSQL
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password
```

### Paso 2: Reconstruir e Iniciar

```powershell
# Detener servicios actuales
docker compose down

# Reconstruir (para instalar pg en el backend)
docker compose build

# Iniciar todos los servicios (incluyendo PostgreSQL)
docker compose up -d
```

### Paso 3: Verificar

```powershell
# Ver que todos los servicios están corriendo
docker compose ps

# Deberías ver:
# - unikuo-backend
# - unikuo-frontend  
# - unikuo-database
```

### Paso 4: Probar

1. Abre: `http://localhost`
2. Haz clic en **"Probar Base de Datos"**
3. Deberías ver: `"Conexión a PostgreSQL exitosa"` ✅
4. Haz clic en **"Obtener Datos DB"**
5. Deberías ver los datos de la tabla de prueba

## 🌐 Configurar en el VPS

### Paso 1: Actualizar .env en el VPS

```bash
cd /root/unikuo_plataform
nano .env
```

Agrega estas líneas:

```env
# Base de datos PostgreSQL
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password_seguro_aqui
```

**⚠️ IMPORTANTE**: Cambia `unikuo_password_seguro_aqui` por una contraseña segura.

### Paso 2: Reconstruir e Iniciar

```bash
# Detener servicios
docker compose down

# Reconstruir backend (para instalar pg)
docker compose build backend

# Iniciar todos los servicios
docker compose up -d

# Verificar
docker compose ps
```

### Paso 3: Probar

1. Abre: `http://89.117.33.122`
2. Haz clic en **"Probar Base de Datos"**
3. Deberías ver éxito ✅

## 🧪 Endpoints Disponibles

### Probar Conexión
```
GET /api/database/test
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Conexión a PostgreSQL exitosa",
  "timestamp": "2026-01-15T07:32:47.685Z"
}
```

### Obtener Datos de Prueba
```
GET /api/database/data
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Datos obtenidos correctamente",
  "data": {
    "id": 1,
    "message": "Base de datos inicializada correctamente",
    "created_at": "2026-01-15T07:32:47.685Z"
  }
}
```

## 📊 Conectarse a PostgreSQL Manualmente

### Desde el Contenedor

```bash
# Conectarse al contenedor de PostgreSQL
docker compose exec database psql -U unikuo_user -d unikuo_plataform

# Ejecutar consultas
SELECT * FROM test_connection;
\dt  # Listar tablas
\q   # Salir
```

### Desde el Host (si tienes psql instalado)

```bash
# Conectarse desde el host
psql -h localhost -p 5432 -U unikuo_user -d unikuo_plataform
```

## 🔧 Solución de Problemas

### Error: "relation does not exist"

El script de inicialización no se ejecutó. Solución:

```bash
# Eliminar el volumen de datos (CUIDADO: esto borra todos los datos)
docker compose down -v

# Iniciar de nuevo (el script se ejecutará)
docker compose up -d
```

### Error: "password authentication failed"

Verifica que las credenciales en `.env` coincidan con las del `docker-compose.yml`.

### El backend no se conecta a la base de datos

1. Verifica que el backend espere a que la base de datos esté lista (ya configurado con `depends_on`)
2. Verifica los logs:
```bash
docker compose logs backend
docker compose logs database
```

### Ver logs de PostgreSQL

```bash
docker compose logs database
```

## 📝 Próximos Pasos

Una vez que verifiques que la conexión funciona:

1. ✅ Base de datos funcionando
2. ⏭️ Crear modelos/tablas para tu aplicación
3. ⏭️ Implementar CRUD básico
4. ⏭️ Agregar migraciones
5. ⏭️ Configurar ORM (opcional: Prisma, TypeORM, etc.)

## 🎯 Estructura de Carpetas

```
unikuo_plataform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # Configuración de conexión
│   │   └── routes/
│   │       └── database.routes.js  # Endpoints de prueba
│   └── package.json             # Incluye 'pg'
├── database/
│   ├── init.sql                 # Script de inicialización
│   └── README.md
└── docker-compose.yml            # Incluye servicio PostgreSQL
```

---

## ✅ Checklist

- [ ] `.env` actualizado con variables de base de datos
- [ ] Servicios reconstruidos (`docker compose build`)
- [ ] Todos los servicios corriendo (`docker compose ps`)
- [ ] Prueba de conexión exitosa en el navegador
- [ ] Puedo obtener datos de prueba

¡Listo para empezar a construir tu aplicación! 🚀
