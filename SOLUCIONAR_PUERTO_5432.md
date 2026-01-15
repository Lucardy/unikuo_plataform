# 🔧 Solucionar Puerto 5432 en Uso

## Problema

El puerto 5432 (PostgreSQL) está siendo usado por otro proceso en el VPS.

## ✅ Solución: Cambiar Puerto de PostgreSQL

Ya actualicé el `docker-compose.yml` para usar el puerto **5433** en lugar de 5432.

### Paso 1: Ver qué está usando el puerto 5432 (opcional)

```bash
sudo netstat -tlnp | grep :5432
```

### Paso 2: Actualizar .env

El `.env` ya está bien, pero verifica que tenga:

```env
DB_PORT=5433
```

O simplemente no lo pongas y usará el default (5433).

### Paso 3: Hacer Pull del Código Actualizado

```bash
cd /root/unikuo_plataform
git pull origin main
```

### Paso 4: Iniciar Servicios

```bash
docker compose up -d
```

### Paso 5: Verificar

```bash
docker compose ps
```

Deberías ver los 3 servicios corriendo.

---

## 📝 Nota Importante

- El puerto **interno** del contenedor sigue siendo 5432 (estándar de PostgreSQL)
- El puerto **externo** (host) ahora es 5433
- El backend se conecta usando `DB_HOST=database` (nombre del servicio), así que no necesita saber el puerto externo
- Solo cambia si quieres conectarte desde fuera del contenedor

---

## ✅ Después de esto

Una vez que funcione, haz push del cambio:

```bash
# En tu computadora
git add docker-compose.yml
git commit -m "Cambiar puerto PostgreSQL a 5433"
git push origin main
```
