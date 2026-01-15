# 📝 Pasos para Crear y Aplicar Migraciones

## 🎯 Flujo Completo (Resumen)

1. **Local**: Crear migración → Ejecutar → Backup → Push
2. **VPS**: Pull → Ejecutar migración

---

## 📍 PASO 1: Crear Nueva Migración (Local)

### ¿Dónde?
En tu máquina local, en la carpeta del proyecto.

### ¿Qué hacer?

1. **Crear el archivo de migración:**

Ve a la carpeta `database/migrations/` y crea un nuevo archivo con el siguiente número.

Ejemplo: Si ya existe `001_initial_schema.sql`, crea `002_nombre_tu_tabla.sql`

```bash
# Desde la raíz del proyecto
cd database/migrations
# Crea el archivo (puedes usar tu editor)
```

2. **Escribir el SQL:**

Abre el archivo y escribe el SQL para crear/modificar tu tabla.

**Ejemplo:** `002_agregar_tabla_productos.sql`

```sql
-- Migración 002: Agregar tabla de productos

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 📍 PASO 2: Ejecutar Migración Localmente (Local)

### ¿Dónde?
En tu máquina local, desde la raíz del proyecto.

### ¿Qué hacer?

```bash
# Asegúrate de que Docker esté corriendo
docker compose -f docker-compose.dev.yml up -d

# Ejecutar la migración
docker compose -f docker-compose.dev.yml exec backend npm run migrate
```

**Resultado esperado:**
```
🚀 Iniciando migraciones de base de datos...
📋 Migraciones ya ejecutadas: 1
📁 Migraciones encontradas: 2
🔄 Migraciones pendientes: 1
📝 Ejecutando: 002_agregar_tabla_productos.sql...
✅ Migración ejecutada: 002_agregar_tabla_productos.sql
✅ ¡Todas las migraciones se ejecutaron correctamente!
```

---

## 📍 PASO 3: Hacer Backup (Local - Opcional pero Recomendado)

### ¿Dónde?
En tu máquina local, desde la raíz del proyecto.

### ¿Qué hacer?

```bash
# Crear backup de tu base de datos local
docker compose -f docker-compose.dev.yml exec backend npm run backup
```

**Resultado esperado:**
```
📦 Creando backup de la base de datos...
📋 Tablas encontradas: 5
  📄 Respaldando tabla: users...
  📄 Respaldando tabla: products...
✅ Backup creado exitosamente!
📁 Archivo: database/backups/backup-2026-01-15T10-30-00.sql
```

El backup se guarda en `database/backups/` (no se sube a Git).

---

## 📍 PASO 4: Hacer Push a GitHub (Local)

### ¿Dónde?
En tu máquina local, desde la raíz del proyecto.

### ¿Qué hacer?

```bash
# Agregar los archivos nuevos
git add database/migrations/002_agregar_tabla_productos.sql

# Hacer commit
git commit -m "Agregar tabla de productos"

# Subir a GitHub
git push origin main
```

---

## 📍 PASO 5: Actualizar en VPS

### ¿Dónde?
En el servidor VPS, conectado por SSH.

### ¿Qué hacer?

1. **Conectarse al VPS:**

```bash
ssh root@89.117.33.122
```

2. **Ir al proyecto:**

```bash
cd /root/unikuo_plataform
```

3. **Actualizar código (si GitHub Actions no lo hizo automáticamente):**

```bash
git pull origin main
```

4. **Hacer Backup del VPS (IMPORTANTE):**

```bash
docker compose exec backend npm run backup
```

5. **Ejecutar Migraciones:**

```bash
docker compose exec backend npm run migrate
```

**Resultado esperado:**
```
🚀 Iniciando migraciones de base de datos...
⚠️  ADVERTENCIA: Estás conectado a una base de datos remota (producción)
   Host: database
📋 Migraciones ya ejecutadas: 1
📁 Migraciones encontradas: 2
🔄 Migraciones pendientes: 1
📝 Ejecutando: 002_agregar_tabla_productos.sql...
✅ Migración ejecutada: 002_agregar_tabla_productos.sql
✅ ¡Todas las migraciones se ejecutaron correctamente!
```

6. **Verificar que funciona:**

```bash
# Ver las tablas
docker compose exec database psql -U unikuo_user -d unikuo_plataform -c "\dt"
```

Deberías ver tu nueva tabla en la lista.

---

## 📋 Resumen Rápido

### En Local:
```bash
# 1. Crear archivo en database/migrations/002_nombre.sql
# 2. Escribir el SQL
# 3. Ejecutar migración
docker compose -f docker-compose.dev.yml exec backend npm run migrate

# 4. Backup (opcional)
docker compose -f docker-compose.dev.yml exec backend npm run backup

# 5. Push
git add database/migrations/002_nombre.sql
git commit -m "Agregar nueva tabla"
git push origin main
```

### En VPS:
```bash
# 1. Conectarse
ssh root@89.117.33.122
cd /root/unikuo_plataform

# 2. Actualizar código
git pull origin main

# 3. Backup (IMPORTANTE)
docker compose exec backend npm run backup

# 4. Ejecutar migraciones
docker compose exec backend npm run migrate
```

---

## ⚠️ Recordatorios Importantes

1. **Números secuenciales**: 001, 002, 003... (no saltes números)
2. **Siempre usar `IF NOT EXISTS`**: Para que no falle si la tabla ya existe
3. **Backup en VPS**: Siempre antes de migrar en producción
4. **Probar localmente primero**: Antes de hacer push

---

## 🆘 Si Algo Sale Mal

### Error: "Migration already exists"
- La migración ya se ejecutó, es normal. No pasa nada.

### Error: "Table already exists"
- Verifica que uses `IF NOT EXISTS` en tu SQL.

### Error de conexión en VPS
- Verifica que Docker esté corriendo: `docker compose ps`
- Verifica que el backend esté healthy: `docker compose logs backend`

### Restaurar desde Backup
```bash
# Ver backups disponibles
ls database/backups/

# Restaurar (ejemplo)
docker compose exec database psql -U unikuo_user -d unikuo_plataform < database/backups/backup-2026-01-15T10-30-00.sql
```
