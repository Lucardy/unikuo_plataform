# 👁️ Ver Base de Datos de Forma Visual

## 🎯 Solución: Adminer

He agregado **Adminer** a tu `docker-compose.yml` y `docker-compose.dev.yml`. Es una herramienta web ligera para gestionar bases de datos.

---

## 🚀 Cómo Usar

### 1. Iniciar Adminer

**Con desarrollo (hot reload):**
```bash
npm run docker:dev
```

**Con producción:**
```bash
npm run docker:prod
```

Adminer se iniciará automáticamente junto con los otros servicios.

### 2. Acceder a Adminer

Abre en tu navegador:
- **Local:** http://localhost:8080

### 3. Conectarse a la Base de Datos

En la pantalla de login de Adminer:

**Sistema:** `PostgreSQL`

**Servidor:** `database` (nombre del servicio Docker)

**Usuario:** `unikuo_user` (o el que tengas en tu `.env`)

**Contraseña:** `unikuo_password` (o la que tengas en tu `.env`)

**Base de datos:** `unikuo_plataform` (o la que tengas en tu `.env`)

**Clic en "Iniciar sesión"**

---

## 📊 Qué Puedes Hacer en Adminer

### Ver Tablas
- Ver todas las tablas de la base de datos
- Ver estructura de cada tabla
- Ver índices y relaciones

### Consultar Datos
- Ejecutar consultas SQL
- Ver datos de las tablas
- Editar datos directamente

### Gestionar Base de Datos
- Crear nuevas tablas
- Modificar tablas existentes
- Ejecutar scripts SQL
- Exportar/Importar datos

---

## 🔧 Configuración

### Credenciales

Las credenciales vienen de tu archivo `.env`:

```env
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password
```

**Servidor:** Siempre usa `database` (nombre del servicio Docker)

---

## 🎯 Ejemplo de Uso

### Ver Tablas Existentes

1. Accede a http://localhost:8080
2. Inicia sesión con las credenciales
3. Verás una lista de tablas:
   - `test_connection`
   - `example_table`
   - Y cualquier otra que hayas creado

### Ver Datos de una Tabla

1. Haz clic en el nombre de la tabla
2. Verás todos los datos
3. Puedes editar, agregar o eliminar filas

### Ejecutar Consultas SQL

1. Haz clic en "SQL command"
2. Escribe tu consulta:
   ```sql
   SELECT * FROM test_connection;
   ```
3. Clic en "Ejecutar"

---

## 🔒 Seguridad

**⚠️ IMPORTANTE:**

- Adminer está disponible en http://localhost:8080
- Solo accesible desde tu máquina local
- En producción, considera protegerlo con autenticación adicional
- No expongas el puerto 8080 públicamente en el VPS

---

## 🆘 Solución de Problemas

### "Cannot connect to database"

**Verificar:**
1. Que el servicio `database` esté corriendo:
   ```bash
   docker compose ps
   ```

2. Que Adminer esté corriendo:
   ```bash
   docker compose ps | grep adminer
   ```

3. Usar el nombre correcto del servidor: `database` (no `localhost`)

### "Access denied"

**Verificar credenciales:**
```bash
cat .env | grep DB_
```

Asegúrate de usar:
- **Servidor:** `database`
- **Usuario:** El de tu `.env`
- **Contraseña:** La de tu `.env`
- **Base de datos:** La de tu `.env`

---

## 📝 Alternativas

### Opción 1: DBeaver (Aplicación de Escritorio)

Si prefieres una aplicación de escritorio:
1. Descargar DBeaver: https://dbeaver.io/
2. Instalar
3. Crear nueva conexión PostgreSQL:
   - Host: `localhost`
   - Port: `5433` (puerto del host)
   - Database: `unikuo_plataform`
   - User: `unikuo_user`
   - Password: `unikuo_password`

### Opción 2: pgAdmin (Interfaz Web Completa)

Más pesado pero más completo. Se puede agregar al docker-compose si lo prefieres.

---

## 🎬 Resumen

**Para ver la base de datos visualmente:**

1. Iniciar servicios: `npm run docker:dev`
2. Abrir: http://localhost:8080
3. Login:
   - Sistema: PostgreSQL
   - Servidor: `database`
   - Usuario/Contraseña: De tu `.env`
4. ¡Explorar! 🎉
