# 📊 Base de Datos - PostgreSQL

Esta carpeta contiene los scripts de inicialización y configuración de la base de datos PostgreSQL.

## 📁 Estructura

```
database/
├── init.sql          # Script de inicialización (se ejecuta automáticamente)
└── README.md         # Esta documentación
```

## 🚀 Inicialización

El archivo `init.sql` se ejecuta automáticamente cuando el contenedor de PostgreSQL se crea por primera vez.

### Contenido del Script

1. **Extensiones**: Crea la extensión `uuid-ossp` para generar UUIDs
2. **Tabla de prueba**: `test_connection` - Para verificar que la conexión funciona
3. **Tabla de ejemplo**: `example_table` - Ejemplo de estructura para futuras tablas
4. **Triggers**: Función para actualizar `updated_at` automáticamente

## 🔧 Configuración

Las variables de entorno se configuran en `.env`:

```env
DB_HOST=database
DB_PORT=5432
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=unikuo_password
```

## 🧪 Probar la Conexión

### Desde el Backend

```bash
# Endpoint de prueba
GET /api/database/test

# Obtener datos de prueba
GET /api/database/data
```

### Desde el Contenedor

```bash
# Conectarse al contenedor de PostgreSQL
docker compose exec database psql -U unikuo_user -d unikuo_plataform

# Ejecutar consultas
SELECT * FROM test_connection;
```

## 📝 Agregar Nuevas Tablas

Para agregar nuevas tablas, edita `init.sql` o crea migraciones separadas.

**Ejemplo:**
```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Migraciones

Para futuras migraciones, considera crear una carpeta `migrations/` con scripts numerados:

```
database/
├── migrations/
│   ├── 001_create_usuarios.sql
│   ├── 002_create_productos.sql
│   └── ...
└── init.sql
```

## 📊 Backup y Restore

### Backup

```bash
docker compose exec database pg_dump -U unikuo_user unikuo_plataform > backup.sql
```

### Restore

```bash
docker compose exec -T database psql -U unikuo_user unikuo_plataform < backup.sql
```
