# 🔄 Sistema de Migraciones de Base de Datos

## 📋 ¿Qué es esto?

Este sistema te permite **sincronizar los cambios de la base de datos** entre tu entorno local y el VPS sin perder datos. En lugar de recrear la base de datos cada vez, puedes crear **migraciones** que se ejecutan automáticamente.

## 🎯 Flujo de Trabajo

### 1. **Desarrollo Local**

Cuando creas nuevas tablas o modificas la estructura:

1. Crea un archivo de migración en `database/migrations/`
2. Ejecuta las migraciones localmente
3. Prueba que todo funciona
4. Haz `git push`

### 2. **Despliegue en VPS**

Cuando haces push y se actualiza el VPS:

1. El código se actualiza automáticamente (GitHub Actions)
2. Ejecutas las migraciones en el VPS
3. ¡Listo! La base de datos está sincronizada

## 📝 Crear una Nueva Migración

### Paso 1: Crear el archivo

Crea un nuevo archivo en `database/migrations/` con el formato:

```
001_nombre_descriptivo.sql
002_otra_migracion.sql
003_agregar_tabla_productos.sql
```

**Importante:** Usa números secuenciales (001, 002, 003...) para que se ejecuten en orden.

### Paso 2: Escribir el SQL

Ejemplo: `database/migrations/003_agregar_tabla_productos.sql`

```sql
-- Migración 003: Agregar tabla de productos

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Trigger para updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### Paso 3: Ejecutar la migración

**Localmente:**
```bash
# Con Docker
docker compose -f docker-compose.dev.yml exec backend npm run migrate

# O directamente
cd backend
npm run migrate
```

**En el VPS:**
```bash
cd /root/unikuo_plataform
docker compose exec backend npm run migrate
```

## 🚀 Comandos Útiles

### Ejecutar migraciones pendientes

```bash
# Local
docker compose -f docker-compose.dev.yml exec backend npm run migrate

# VPS
docker compose exec backend npm run migrate
```

### Ver migraciones ejecutadas

Puedes conectarte a la base de datos y ver la tabla `migrations`:

```bash
# Local
docker compose -f docker-compose.dev.yml exec database psql -U unikuo_user -d unikuo_plataform -c "SELECT * FROM migrations ORDER BY executed_at;"

# VPS
docker compose exec database psql -U unikuo_user -d unikuo_plataform -c "SELECT * FROM migrations ORDER BY executed_at;"
```

O usar Adminer:
- Local: http://localhost:8080
- VPS: http://89.117.33.122:8080

## 📋 Ejemplo Completo

### Escenario: Agregar tabla de tiendas

1. **Crear la migración:**

`database/migrations/004_agregar_tabla_stores.sql`

```sql
-- Migración 004: Agregar tabla de tiendas

CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);

CREATE TRIGGER update_stores_updated_at 
    BEFORE UPDATE ON stores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

2. **Ejecutar localmente:**

```bash
docker compose -f docker-compose.dev.yml exec backend npm run migrate
```

3. **Probar que funciona:**

```bash
# Verificar que la tabla existe
docker compose -f docker-compose.dev.yml exec database psql -U unikuo_user -d unikuo_plataform -c "\dt stores"
```

4. **Hacer commit y push:**

```bash
git add database/migrations/004_agregar_tabla_stores.sql
git commit -m "Agregar tabla de tiendas"
git push origin main
```

5. **En el VPS, ejecutar migraciones:**

```bash
cd /root/unikuo_plataform
git pull origin main
docker compose exec backend npm run migrate
```

## ⚠️ Reglas Importantes

### ✅ HACER:

- ✅ Usar `IF NOT EXISTS` en todas las creaciones de tablas
- ✅ Usar `ON CONFLICT DO NOTHING` en INSERTs
- ✅ Numerar las migraciones secuencialmente
- ✅ Probar localmente antes de hacer push
- ✅ Usar nombres descriptivos para los archivos

### ❌ NO HACER:

- ❌ Modificar migraciones ya ejecutadas (crea una nueva)
- ❌ Eliminar migraciones que ya se ejecutaron en producción
- ❌ Usar `DROP TABLE` sin cuidado (puede borrar datos)
- ❌ Saltar números en la secuencia (001, 002, 004 ❌)

## 🔍 Solución de Problemas

### Error: "Migration already exists"

Si una migración ya se ejecutó pero quieres modificarla:

1. **NO modifiques el archivo existente**
2. Crea una nueva migración con el siguiente número
3. Ejecuta la nueva migración

### Error: "Table already exists"

Esto es normal si la tabla ya existe. El script usa `IF NOT EXISTS`, así que no debería fallar. Si falla, verifica que el SQL esté correcto.

### Ver qué migraciones están pendientes

El script te mostrará automáticamente cuántas migraciones están pendientes cuando lo ejecutes.

## 📚 Estructura de Archivos

```
database/
├── init.sql                    # Script inicial (solo para nuevas instalaciones)
├── migrations/                 # Migraciones (se ejecutan en orden)
│   ├── 001_initial_schema.sql
│   ├── 002_agregar_campos.sql
│   └── 003_otra_migracion.sql
└── README.md

backend/
└── src/
    └── scripts/
        └── runMigrations.js    # Script que ejecuta las migraciones
```

## 🎓 Buenas Prácticas

1. **Una migración = Un cambio lógico**
   - No mezcles múltiples cambios no relacionados en una sola migración
   - Ejemplo: Si agregas productos Y categorías, haz dos migraciones separadas

2. **Siempre prueba localmente primero**
   - Ejecuta las migraciones en local
   - Verifica que todo funciona
   - Luego haz push

3. **Documenta cambios importantes**
   - Agrega comentarios en el SQL explicando qué hace
   - Si es un cambio grande, documenta en el commit

4. **Backup antes de migraciones grandes**
   - Si vas a hacer cambios destructivos, haz backup primero
   - Especialmente en producción (VPS)

## 🔄 Migración desde el Sistema Anterior

Si ya tienes una base de datos con tablas creadas por `init.sql`:

1. La primera migración (`001_initial_schema.sql`) contiene todo el schema inicial
2. Al ejecutar migraciones, verificará si las tablas ya existen
3. Solo registrará la migración como ejecutada
4. No duplicará tablas (usa `IF NOT EXISTS`)

## 📞 ¿Necesitas Ayuda?

Si tienes problemas con las migraciones:

1. Revisa los logs: `docker compose logs backend`
2. Verifica la conexión a la base de datos
3. Asegúrate de que el archivo de migración tenga la sintaxis correcta
4. Verifica que el número de migración sea secuencial
