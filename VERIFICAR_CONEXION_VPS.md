# 🔍 Verificar Conexión al VPS desde Local

## 🎯 Problema

Adminer queda cargando al intentar conectarse a la BD del VPS. Esto generalmente es un problema de:
- Firewall bloqueando el puerto
- PostgreSQL no configurado para conexiones remotas
- Puerto no expuesto correctamente

## ✅ Pasos para Verificar

### 1. Verificar que el puerto esté expuesto en Docker (VPS)

Conéctate al VPS y verifica:

```bash
ssh root@89.117.33.122
cd /root/unikuo_plataform

# Ver qué puertos están expuestos
docker compose ps

# O más detallado
docker compose port database 5432
```

Deberías ver que el puerto 5433 está mapeado.

### 2. Verificar que el puerto esté abierto en el firewall (VPS)

```bash
# En el VPS, verificar firewall
sudo ufw status

# Si está activo, agregar regla para el puerto 5433
sudo ufw allow 5433/tcp

# O si usas iptables
sudo iptables -L -n | grep 5433
```

### 3. Verificar que PostgreSQL acepte conexiones remotas (VPS)

PostgreSQL por defecto solo acepta conexiones locales. Necesitamos verificar la configuración:

```bash
# En el VPS, entrar al contenedor de la BD
docker compose exec database sh

# Ver el archivo de configuración
cat /var/lib/postgresql/data/pg_hba.conf | grep -v "^#"

# Debería tener algo como:
# host    all    all    0.0.0.0/0    md5
```

Si no está configurado, necesitamos modificarlo.

### 4. Probar conexión desde tu máquina local

```bash
# Desde tu PC local, probar si el puerto responde
telnet 89.117.33.122 5433

# O con PowerShell
Test-NetConnection -ComputerName 89.117.33.122 -Port 5433
```

Si no responde, el firewall está bloqueando.

## 🔧 Soluciones

### Solución 1: Configurar PostgreSQL para conexiones remotas (VPS)

Si PostgreSQL no acepta conexiones remotas, necesitamos modificar la configuración:

```bash
# En el VPS
cd /root/unikuo_plataform

# Entrar al contenedor
docker compose exec database sh

# Editar pg_hba.conf
echo "host    all    all    0.0.0.0/0    md5" >> /var/lib/postgresql/data/pg_hba.conf

# Editar postgresql.conf para escuchar en todas las interfaces
echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf

# Reiniciar el contenedor
exit
docker compose restart database
```

**⚠️ ADVERTENCIA:** Esto permite conexiones desde cualquier IP. Para producción, deberías restringir a IPs específicas.

### Solución 2: Abrir puerto en firewall (VPS)

```bash
# Si usas UFW
sudo ufw allow 5433/tcp
sudo ufw reload

# Si usas firewalld
sudo firewall-cmd --permanent --add-port=5433/tcp
sudo firewall-cmd --reload

# Verificar
sudo ufw status
# o
sudo firewall-cmd --list-ports
```

### Solución 3: Usar SSH Tunnel (Alternativa Segura)

Si no quieres exponer el puerto públicamente, puedes usar un túnel SSH:

```bash
# Desde tu PC local
ssh -L 5433:localhost:5432 root@89.117.33.122

# Esto crea un túnel: localhost:5433 -> VPS:5432
# Luego en Adminer usa: localhost:5433
```

## 🧪 Prueba Rápida

### Desde tu PC local:

```powershell
# PowerShell
Test-NetConnection -ComputerName 89.117.33.122 -Port 5433
```

Si dice "TcpTestSucceeded : True", el puerto está abierto.

Si dice "TcpTestSucceeded : False", el firewall está bloqueando.

## 📋 Checklist

- [ ] Puerto 5433 expuesto en docker-compose.yml
- [ ] Firewall del VPS permite puerto 5433
- [ ] PostgreSQL configurado para aceptar conexiones remotas
- [ ] Contenedor de BD corriendo en el VPS
- [ ] Test de conexión desde local funciona

## 🆘 Si Nada Funciona

### Alternativa: Usar Adminer del VPS

En lugar de conectarte desde local, puedes usar Adminer que ya está corriendo en el VPS:

1. Abre: http://89.117.33.122:8080
2. Usa los mismos datos pero con servidor: `database` (nombre del contenedor)

Esto funciona porque Adminer está dentro de la misma red Docker que la BD.
