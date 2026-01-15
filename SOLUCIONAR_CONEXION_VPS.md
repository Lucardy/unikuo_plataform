# 🔧 Solucionar Conexión a BD del VPS

## 🎯 Problema

Adminer queda cargando al intentar conectarse. Probablemente:
1. Firewall bloqueando el puerto 5433
2. PostgreSQL no acepta conexiones remotas

## ✅ Solución Rápida

### Paso 1: Verificar puerto desde tu PC local

Abre PowerShell y ejecuta:

```powershell
Test-NetConnection -ComputerName 89.117.33.122 -Port 5433
```

**Si dice "TcpTestSucceeded : False"** → El firewall está bloqueando
**Si dice "TcpTestSucceeded : True"** → El puerto está abierto, pero puede ser PostgreSQL

### Paso 2: Abrir puerto en el firewall del VPS

Conéctate al VPS:

```bash
ssh root@89.117.33.122
```

Luego ejecuta:

```bash
# Verificar si hay firewall activo
sudo ufw status

# Si está activo, abrir el puerto
sudo ufw allow 5433/tcp
sudo ufw reload

# Verificar que se abrió
sudo ufw status | grep 5433
```

### Paso 3: Configurar PostgreSQL para conexiones remotas

PostgreSQL por defecto solo acepta conexiones locales. Necesitamos configurarlo:

```bash
# En el VPS, entrar al contenedor de la BD
cd /root/unikuo_plataform
docker compose exec database sh

# Dentro del contenedor, editar configuración
echo "host    all    all    0.0.0.0/0    md5" >> /var/lib/postgresql/data/pg_hba.conf
echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf

# Salir del contenedor
exit

# Reiniciar el contenedor de BD
docker compose restart database

# Esperar unos segundos y verificar
docker compose ps
```

### Paso 4: Verificar que funciona

Desde tu PC local, prueba de nuevo:

```powershell
Test-NetConnection -ComputerName 89.117.33.122 -Port 5433
```

Ahora debería decir "TcpTestSucceeded : True"

Luego intenta Adminer de nuevo: http://localhost:8080

## 🆘 Alternativa: Usar Adminer del VPS

Si no puedes abrir el puerto, usa Adminer que ya está en el VPS:

1. Abre: **http://89.117.33.122:8080**
2. Sistema: `PostgreSQL`
3. Servidor: `database` (nombre del contenedor, no la IP)
4. Usuario: `unikuo_user`
5. Contraseña: (la del VPS)
6. Base de datos: `unikuo_plataform`

Esto funciona porque Adminer está en la misma red Docker que la BD.

## 📋 Comandos Completos (Copia y Pega)

### En el VPS:

```bash
# 1. Abrir puerto en firewall
sudo ufw allow 5433/tcp
sudo ufw reload

# 2. Configurar PostgreSQL
cd /root/unikuo_plataform
docker compose exec database sh -c "echo 'host    all    all    0.0.0.0/0    md5' >> /var/lib/postgresql/data/pg_hba.conf"
docker compose exec database sh -c "echo \"listen_addresses = '*'\" >> /var/lib/postgresql/data/postgresql.conf"

# 3. Reiniciar BD
docker compose restart database

# 4. Verificar
docker compose ps
```

### En tu PC local:

```powershell
# Probar conexión
Test-NetConnection -ComputerName 89.117.33.122 -Port 5433
```

## ⚠️ Nota de Seguridad

Abrir el puerto 5433 públicamente permite que cualquiera intente conectarse. Para producción, considera:

1. Restringir a IPs específicas en `pg_hba.conf`
2. Usar un túnel SSH en lugar de exponer el puerto
3. Cambiar el puerto a uno no estándar

Pero para desarrollo, está bien así.
