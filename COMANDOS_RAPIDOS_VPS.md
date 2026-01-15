# ⚡ Comandos Rápidos para el VPS

Guía rápida de comandos útiles una vez que tengas todo configurado.

## 🔄 Actualizar el Proyecto

Cuando hagas cambios y quieras actualizar el VPS:

### 1. Subir archivos nuevos
```bash
# Desde tu computadora (PowerShell)
cd "C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform"
scp -r src server/src root@TU_IP:/root/unikuo_plataform/
```

### 2. En el VPS, actualizar dependencias y rebuild
```bash
# Conectarse al VPS
ssh root@TU_IP

# Ir al proyecto
cd /root/unikuo_plataform

# Actualizar dependencias del frontend (si agregaste nuevas)
npm install

# Rebuild del frontend
npm run build

# Actualizar dependencias del backend (si agregaste nuevas)
cd server
npm install
cd ..

# Reiniciar el backend
pm2 restart unikuo-backend
```

## 📋 Comandos PM2 (Backend)

```bash
# Ver todos los procesos
pm2 list

# Ver logs en tiempo real
pm2 logs unikuo-backend

# Ver solo errores
pm2 logs unikuo-backend --err

# Reiniciar
pm2 restart unikuo-backend

# Detener
pm2 stop unikuo-backend

# Iniciar
pm2 start unikuo-backend

# Eliminar proceso
pm2 delete unikuo-backend

# Ver información detallada
pm2 show unikuo-backend

# Monitoreo en tiempo real
pm2 monit
```

## 🌐 Comandos Nginx

```bash
# Ver estado
sudo systemctl status nginx

# Reiniciar
sudo systemctl restart nginx

# Recargar configuración (sin downtime)
sudo nginx -s reload

# Verificar configuración
sudo nginx -t

# Ver logs de acceso
sudo tail -f /var/log/nginx/access.log

# Ver logs de errores
sudo tail -f /var/log/nginx/error.log
```

## 🔍 Verificar que Todo Funciona

```bash
# Verificar que el backend está corriendo
pm2 list

# Verificar que nginx está corriendo
sudo systemctl status nginx

# Verificar que el puerto 3000 está escuchando
sudo netstat -tlnp | grep 3000

# Verificar que el puerto 80 está escuchando
sudo netstat -tlnp | grep 80

# Probar el API directamente
curl http://localhost:3000/api/test
```

## 📊 Ver Uso de Recursos

```bash
# Ver uso de CPU y memoria (PM2)
pm2 monit

# Ver uso general del sistema
htop
# O si no tienes htop:
top

# Ver espacio en disco
df -h

# Ver tamaño de carpetas
du -sh /root/unikuo_plataform/*
```

## 🔧 Editar Archivos

```bash
# Editar variables de entorno del backend
nano /root/unikuo_plataform/server/.env

# Editar variables de entorno del frontend
nano /root/unikuo_plataform/.env

# Editar configuración de nginx
sudo nano /etc/nginx/sites-available/unikuo
```

## 🚨 Si Algo Sale Mal

```bash
# Ver todos los logs del backend
pm2 logs unikuo-backend --lines 100

# Ver logs de nginx
sudo tail -100 /var/log/nginx/error.log

# Reiniciar todo
pm2 restart unikuo-backend
sudo systemctl restart nginx

# Ver qué procesos están usando los puertos
sudo lsof -i :3000
sudo lsof -i :80
```

## 🔄 Reiniciar Todo el Sistema

```bash
# Reiniciar el servidor (cuidado, desconecta la sesión SSH)
sudo reboot

# Después de reiniciar, verificar que PM2 inició automáticamente
pm2 list
```

## 📝 Cambiar Variables de Entorno

Después de cambiar `.env`, siempre reinicia:

```bash
# Backend
pm2 restart unikuo-backend

# Nginx (si cambiaste configuración)
sudo nginx -t  # Verificar primero
sudo systemctl restart nginx
```
