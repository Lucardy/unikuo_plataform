# 📁 Ubicación Física de la Base de Datos

## ¿Dónde se Guarda?

La base de datos PostgreSQL se guarda en un **volumen de Docker** llamado `postgres-data`.

### En el docker-compose.yml

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
```

Esto significa:
- **Nombre del volumen**: `postgres-data`
- **Dentro del contenedor**: `/var/lib/postgresql/data` (ruta estándar de PostgreSQL)
- **En el host (VPS)**: Docker lo guarda en su directorio de volúmenes

## Ubicación Real en el VPS

Docker guarda los volúmenes en:
```
/var/lib/docker/volumes/
```

El nombre completo del volumen será:
```
unikuo_plataform_postgres-data
```

**Ruta completa**:
```
/var/lib/docker/volumes/unikuo_plataform_postgres-data/_data
```

## Cómo Verificar la Ubicación

### 1. Ver Información del Volumen

```bash
docker volume inspect unikuo_plataform_postgres-data
```

Esto te mostrará:
- `Mountpoint`: La ruta exacta donde está guardado
- `Name`: El nombre del volumen
- `CreatedAt`: Cuándo se creó

### 2. Ver Todos los Volúmenes

```bash
docker volume ls
```

### 3. Ver el Tamaño del Volumen

```bash
du -sh /var/lib/docker/volumes/unikuo_plataform_postgres-data/_data
```

## Estructura Interna

Dentro de `_data` encontrarás:
```
_data/
├── base/          # Bases de datos (archivos de datos)
├── global/        # Tablas del sistema
├── pg_wal/        # Write-Ahead Log (transacciones)
├── pg_tblspc/     # Tablespaces
└── ...            # Otros archivos del sistema PostgreSQL
```

## ⚠️ Importante

1. **No modifiques directamente**: Los archivos dentro de `_data` son binarios de PostgreSQL. Modificarlos directamente puede corromper la base de datos.

2. **Backups**: Si necesitas hacer backup, usa comandos de PostgreSQL:
   ```bash
   docker compose exec database pg_dump -U unikuo_user unikuo_plataform > backup.sql
   ```

3. **Persistencia**: Los datos persisten aunque detengas o elimines el contenedor, **PERO** si eliminas el volumen (`docker volume rm`), se pierden todos los datos.

## Ver el Contenido (Solo Lectura)

Si quieres ver qué hay dentro (sin modificar):

```bash
# Ver estructura
ls -la /var/lib/docker/volumes/unikuo_plataform_postgres-data/_data

# Ver tamaño
du -sh /var/lib/docker/volumes/unikuo_plataform_postgres-data/_data/*
```

## Resumen

- **Ubicación física**: `/var/lib/docker/volumes/unikuo_plataform_postgres-data/_data`
- **Tipo**: Volumen de Docker (managed volume)
- **Persistencia**: Los datos se mantienen aunque reinicies el contenedor
- **Backup**: Usa `pg_dump` desde dentro del contenedor
- **No modifiques**: Los archivos directamente, usa comandos SQL
