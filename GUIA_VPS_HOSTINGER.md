# 🚀 Guía Completa: Desplegar en VPS Hostinger

Esta guía te llevará paso a paso para subir tu proyecto al VPS de Hostinger.

## 📌 Resumen Rápido

Si ya sabes lo que haces, aquí está el resumen:

1. Conectarse al VPS: `ssh root@TU_IP`
2. Instalar Node.js si no está
3. Subir archivos (FileZilla o SCP)
4. Instalar dependencias: `npm install` (frontend y backend)
5. Configurar `.env` en frontend y backend
6. Build frontend: `npm run build`
7. Instalar PM2: `npm install -g pm2`
8. Iniciar backend: `cd server && pm2 start ecosystem.config.js`
9. Instalar y configurar Nginx
10. Configurar firewall
11. Probar

**Si es tu primera vez, sigue la guía completa paso a paso abajo 👇**

---

## 📋 PASO 1: Obtener Información del VPS

Antes de empezar, necesitas tener:

1. **IP del VPS** - La encuentras en el panel de Hostinger
2. **Usuario SSH** - Generalmente `root` o el usuario que creaste
3. **Contraseña SSH** - O clave SSH si configuraste una
4. **Puerto SSH** - Generalmente `22` (por defecto)

**¿Dónde encontrar esto?**
- Ve al panel de Hostinger → VPS → Tu servidor → "Acceso SSH"

---

## 🔐 PASO 2: Conectarse al VPS por SSH

### Opción A: Usando PowerShell (Windows)

1. Abre PowerShell en tu computadora
2. Ejecuta este comando (reemplaza con tus datos):

```powershell
ssh root@TU_IP_DEL_VPS
```

O si tu usuario es diferente:

```powershell
ssh TU_USUARIO@TU_IP_DEL_VPS
```

3. Te pedirá la contraseña, escríbela (no verás lo que escribes, es normal)
4. Si es la primera vez, te preguntará si confías en el servidor, escribe `yes`

### Opción B: Usando PuTTY (Más fácil para Windows)

1. Descarga PuTTY desde: https://www.putty.org/
2. Abre PuTTY
3. En "Host Name" pon: `TU_IP_DEL_VPS`
4. Puerto: `22`
5. Tipo de conexión: `SSH`
6. Click en "Open"
7. Ingresa tu usuario y contraseña cuando te lo pida

---

## ✅ PASO 3: Verificar Node.js

Una vez conectado al VPS, verifica si Node.js está instalado:

```bash
node --version
npm --version
```

### Si NO está instalado Node.js:

**Para Ubuntu/Debian (la mayoría de VPS de Hostinger):**

```bash
# Actualizar el sistema
sudo apt update

# Instalar Node.js 18.x (versión LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

**Si tienes problemas, prueba con nvm (Node Version Manager):**

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recargar la configuración
source ~/.bashrc

# Instalar Node.js 18
nvm install 18
nvm use 18

# Verificar
node --version
```

---

## 📁 PASO 4: Preparar el Proyecto Localmente

Antes de subir, prepara el proyecto en tu computadora:

### 4.1. Crear archivo .env para producción

**En la raíz del proyecto** (donde está `package.json`), crea `.env`:

```env
VITE_API_URL=http://TU_IP_DEL_VPS:3000
```

**En la carpeta `server/`**, crea `server/.env`:

```env
PORT=3000
NODE_ENV=production
API_URL=http://TU_IP_DEL_VPS:3000
FRONTEND_URL=http://TU_IP_DEL_VPS
ALLOWED_ORIGINS=http://TU_IP_DEL_VPS,http://TU_DOMINIO.com
```

> ⚠️ **IMPORTANTE**: Reemplaza `TU_IP_DEL_VPS` con la IP real de tu VPS. Si tienes un dominio, también puedes usar `http://tu-dominio.com`

### 4.2. Hacer build del frontend

En tu computadora, en la carpeta del proyecto:

```bash
npm run build
```

Esto creará la carpeta `dist/` con los archivos compilados.

---

## 📤 PASO 5: Subir Archivos al VPS

Tienes dos opciones:

### Opción A: Usando SCP (desde PowerShell)

Desde tu computadora, en PowerShell:

```powershell
# Ir a la carpeta del proyecto
cd "C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform"

# Subir todo el proyecto (excepto node_modules)
scp -r -o StrictHostKeyChecking=no . root@TU_IP_DEL_VPS:/root/unikuo_plataform
```

Esto subirá todos los archivos. Puede tardar unos minutos.

### Opción B: Usando FileZilla (Más fácil)

1. Descarga FileZilla: https://filezilla-project.org/
2. Abre FileZilla
3. En la parte superior:
   - **Host**: `sftp://TU_IP_DEL_VPS`
   - **Usuario**: `root` (o tu usuario)
   - **Contraseña**: Tu contraseña SSH
   - **Puerto**: `22`
4. Click en "Conexión rápida"
5. Navega a `/root/` en el servidor
6. Arrastra toda la carpeta `unikuo_plataform` desde tu computadora al servidor

> ⚠️ **NOTA**: No subas la carpeta `node_modules` (es muy pesada). La recrearemos en el servidor.

---

## 🏗️ PASO 6: Instalar Dependencias en el VPS

Una vez subidos los archivos, vuelve a la terminal SSH y:

```bash
# Ir a la carpeta del proyecto
cd /root/unikuo_plataform

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
cd ..
```

---

## 🔧 PASO 7: Configurar Variables de Entorno en el VPS

### 7.1. Frontend

```bash
cd /root/unikuo_plataform
nano .env
```

Pega esto (ajusta la IP):

```env
VITE_API_URL=http://TU_IP_DEL_VPS:3000
```

Guarda con: `Ctrl + O`, luego `Enter`, luego `Ctrl + X`

### 7.2. Backend

```bash
cd /root/unikuo_plataform/server
nano .env
```

Pega esto (ajusta la IP):

```env
PORT=3000
NODE_ENV=production
API_URL=http://TU_IP_DEL_VPS:3000
FRONTEND_URL=http://TU_IP_DEL_VPS
ALLOWED_ORIGINS=http://TU_IP_DEL_VPS
```

Guarda con: `Ctrl + O`, luego `Enter`, luego `Ctrl + X`

### 7.3. Rebuild del frontend en el servidor

```bash
cd /root/unikuo_plataform
npm run build
```

---

## 🚀 PASO 8: Instalar PM2 (Para mantener el backend corriendo)

PM2 es un gestor de procesos que mantiene tu aplicación corriendo incluso si se cierra la conexión SSH.

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Ir a la carpeta del servidor
cd /root/unikuo_plataform/server

# Crear carpeta de logs si no existe
mkdir -p logs

# Iniciar el backend con PM2 usando el archivo de configuración
pm2 start ecosystem.config.js

# Guardar la configuración para que se inicie automáticamente al reiniciar
pm2 save
pm2 startup
```

El último comando (`pm2 startup`) te dará un comando para ejecutar, cópialo y ejecútalo. Esto hará que PM2 se inicie automáticamente cuando el servidor se reinicie.

**Comandos útiles de PM2:**

```bash
pm2 list              # Ver procesos corriendo
pm2 logs unikuo-backend  # Ver logs del backend
pm2 restart unikuo-backend  # Reiniciar el backend
pm2 stop unikuo-backend     # Detener el backend
pm2 delete unikuo-backend   # Eliminar el proceso
```

---

## 🌐 PASO 9: Configurar Nginx (Servidor Web)

Nginx servirá el frontend y hará proxy al backend.

### 9.1. Instalar Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 9.2. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/unikuo
```

Pega esta configuración (ajusta las rutas si es necesario):

```nginx
# Servidor para el frontend
server {
    listen 80;
    server_name TU_IP_DEL_VPS;  # O tu dominio si lo tienes
    
    # Carpeta donde está el frontend compilado
    root /root/unikuo_plataform/dist;
    index index.html;
    
    # Servir archivos estáticos
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy para el backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Guarda con: `Ctrl + O`, `Enter`, `Ctrl + X`

### 9.3. Activar el sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/unikuo /etc/nginx/sites-enabled/

# Eliminar configuración por defecto (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Probar la configuración
sudo nginx -t

# Si todo está bien, reiniciar nginx
sudo systemctl restart nginx

# Hacer que nginx inicie automáticamente
sudo systemctl enable nginx
```

---

## 🔥 PASO 10: Configurar Firewall (UFW)

Permitir tráfico HTTP y HTTPS:

```bash
# Ver estado del firewall
sudo ufw status

# Permitir SSH (IMPORTANTE: hazlo primero o te quedarás fuera)
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir el puerto del backend (por si quieres acceder directamente)
sudo ufw allow 3000/tcp

# Activar el firewall
sudo ufw enable

# Verificar
sudo ufw status
```

---

## ✅ PASO 11: Checklist Final

Marca cada paso cuando lo completes:

- [ ] Conectado al VPS por SSH
- [ ] Node.js instalado y funcionando
- [ ] Archivos subidos al VPS
- [ ] Dependencias instaladas (frontend y backend)
- [ ] Variables de entorno configuradas
- [ ] Frontend compilado (`npm run build`)
- [ ] PM2 instalado y backend corriendo
- [ ] Nginx instalado y configurado
- [ ] Firewall configurado
- [ ] Frontend accesible desde el navegador
- [ ] API respondiendo correctamente
- [ ] Prueba de conexión desde el frontend funciona

## 🧪 PASO 12: Probar que Todo Funciona

### 12.1. Verificar que el backend está corriendo

```bash
pm2 list
```

Deberías ver `unikuo-backend` en la lista.

### 12.2. Verificar que nginx está corriendo

```bash
sudo systemctl status nginx
```

### 12.3. Probar en el navegador

Abre tu navegador y ve a:

- `http://TU_IP_DEL_VPS` - Deberías ver el frontend
- `http://TU_IP_DEL_VPS/api/test` - Deberías ver la respuesta del API

### 12.4. Probar la conexión desde el frontend

1. Ve a `http://TU_IP_DEL_VPS` en tu navegador
2. Haz clic en "Probar Conexión"
3. Deberías ver un mensaje de éxito ✅

---

## 🐛 Solución de Problemas

### El backend no inicia

```bash
# Ver logs
pm2 logs unikuo-backend

# Verificar que Node.js está instalado
node --version

# Verificar que las dependencias están instaladas
cd /root/unikuo_plataform/server
npm list
```

### Nginx da error 502

```bash
# Verificar que el backend está corriendo
pm2 list

# Ver logs de nginx
sudo tail -f /var/log/nginx/error.log

# Verificar que el puerto 3000 está escuchando
sudo netstat -tlnp | grep 3000
```

### No puedo acceder desde el navegador

```bash
# Verificar que nginx está corriendo
sudo systemctl status nginx

# Verificar que el firewall permite el puerto 80
sudo ufw status

# Verificar logs de nginx
sudo tail -f /var/log/nginx/access.log
```

### Error de CORS

Asegúrate de que en `server/.env` tienes:

```env
ALLOWED_ORIGINS=http://TU_IP_DEL_VPS
```

Y reinicia el backend:

```bash
pm2 restart unikuo-backend
```

---

## 📝 Comandos Útiles de Referencia

```bash
# Ver procesos PM2
pm2 list

# Ver logs del backend
pm2 logs unikuo-backend

# Reiniciar backend
pm2 restart unikuo-backend

# Ver estado de nginx
sudo systemctl status nginx

# Reiniciar nginx
sudo systemctl restart nginx

# Ver logs de nginx
sudo tail -f /var/log/nginx/error.log

# Ver qué está escuchando en los puertos
sudo netstat -tlnp
```

---

## 🎉 ¡Listo!

Si todo funcionó, ya tienes tu plataforma corriendo en el VPS. 

### ✅ Verificación Final

Antes de celebrar, verifica que todo funciona:

1. **Frontend accesible**: `http://TU_IP_DEL_VPS` muestra tu aplicación
2. **API funciona**: `http://TU_IP_DEL_VPS/api/test` devuelve JSON
3. **Conexión desde frontend**: El botón "Probar Conexión" funciona
4. **Backend corriendo**: `pm2 list` muestra `unikuo-backend` como "online"
5. **Nginx corriendo**: `sudo systemctl status nginx` muestra "active (running)"

### 📚 Archivos de Referencia

- **Comandos rápidos**: Ver `COMANDOS_RAPIDOS_VPS.md`
- **Instrucciones generales**: Ver `INSTRUCCIONES.md`
- **README principal**: Ver `README.md`

**Próximos pasos sugeridos:**
- Configurar un dominio (si lo tienes)
- Configurar SSL/HTTPS con Let's Encrypt (gratis)
- Configurar base de datos cuando la necesites
- Configurar backups automáticos
- Configurar monitoreo (opcional)

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa los logs: `pm2 logs unikuo-backend`
2. Revisa los logs de nginx: `sudo tail -f /var/log/nginx/error.log`
3. Verifica que todos los servicios están corriendo
4. Revisa las variables de entorno
