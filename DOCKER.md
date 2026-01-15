# 🐳 Guía de Docker - Unikuo Platform

Esta guía explica cómo usar Docker para desarrollar y desplegar la plataforma.

## 📁 Estructura del Proyecto

```
unikuo_plataform/
├── backend/              # Backend Node.js + Express
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/             # Frontend React + Vite
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── docker-compose.yml     # Orquestación de servicios
├── .env.example          # Variables de entorno de ejemplo
└── README.md
```

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:

```env
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=80
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost
ALLOWED_ORIGINS=http://localhost,http://127.0.0.1
```

### 2. Construir y Ejecutar

```bash
# Construir las imágenes
docker-compose build

# Iniciar los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 3. Acceder a la Aplicación

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/test/health

## 🛠️ Comandos Útiles

### Gestión de Servicios

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Reconstruir Imágenes

```bash
# Reconstruir todas las imágenes
docker-compose build --no-cache

# Reconstruir solo el backend
docker-compose build --no-cache backend

# Reconstruir solo el frontend
docker-compose build --no-cache frontend
```

### Ejecutar Comandos Dentro de los Contenedores

```bash
# Ejecutar comando en el backend
docker-compose exec backend npm install

# Abrir shell en el backend
docker-compose exec backend sh

# Abrir shell en el frontend
docker-compose exec frontend sh
```

## 🔧 Desarrollo Local

### Modo Desarrollo con Hot Reload

Para desarrollo, puedes montar volúmenes para que los cambios se reflejen automáticamente:

```yaml
# Agregar a docker-compose.yml (versión desarrollo)
volumes:
  - ./backend/src:/app/src
  - ./frontend/src:/app/src
```

O mejor aún, usa el modo desarrollo sin Docker:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Despliegue en VPS

### 1. Preparar el VPS

```bash
# Instalar Docker y Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y

# Agregar tu usuario al grupo docker (opcional)
sudo usermod -aG docker $USER
```

### 2. Subir el Proyecto

```bash
# Clonar o subir el proyecto al VPS
git clone tu-repositorio
cd unikuo_plataform
```

### 3. Configurar Variables de Entorno

```bash
# Crear .env
cp .env.example .env

# Editar con tus valores de producción
nano .env
```

Ajusta las URLs para producción:

```env
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=80
API_URL=http://TU_IP_O_DOMINIO:3000
FRONTEND_URL=http://TU_IP_O_DOMINIO
ALLOWED_ORIGINS=http://TU_IP_O_DOMINIO,http://TU_DOMINIO.com
```

### 4. Construir y Ejecutar

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Verificar que están corriendo
docker-compose ps
```

### 5. Configurar Nginx (Opcional pero Recomendado)

Si quieres usar Nginx como reverse proxy (recomendado para producción):

```nginx
# /etc/nginx/sites-available/unikuo
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 📊 Monitoreo

### Ver Uso de Recursos

```bash
# Ver uso de recursos de los contenedores
docker stats

# Ver información detallada de un contenedor
docker inspect unikuo-backend
docker inspect unikuo-frontend
```

### Health Checks

Los servicios tienen health checks configurados:

```bash
# Ver estado de health checks
docker-compose ps
```

## 🗄️ Base de Datos (Para Más Adelante)

Cuando agregues base de datos, descomenta la sección en `docker-compose.yml`:

```yaml
database:
  image: mysql:8.0
  container_name: unikuo-database
  environment:
    - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
    - MYSQL_DATABASE=${DB_NAME}
    - MYSQL_USER=${DB_USER}
    - MYSQL_PASSWORD=${DB_PASSWORD}
  ports:
    - "${DB_PORT:-3306}:3306"
  volumes:
    - mysql-data:/var/lib/mysql
  networks:
    - unikuo-network
```

Y agrega las variables al `.env`:

```env
DB_HOST=database
DB_PORT=3306
DB_NAME=unikuo_plataform
DB_USER=unikuo_user
DB_PASSWORD=tu_password_seguro
DB_ROOT_PASSWORD=root_password_seguro
```

## 🔍 Solución de Problemas

### Los contenedores no inician

```bash
# Ver logs de errores
docker-compose logs

# Verificar configuración
docker-compose config

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### El frontend no se conecta al backend

1. Verifica que ambos contenedores estén corriendo: `docker-compose ps`
2. Verifica las variables de entorno en `.env`
3. Verifica que `ALLOWED_ORIGINS` incluya la URL del frontend
4. Revisa los logs: `docker-compose logs backend`

### Cambios no se reflejan

```bash
# Reconstruir la imagen
docker-compose build --no-cache frontend
docker-compose up -d --force-recreate frontend
```

### Limpiar Todo

```bash
# Detener y eliminar contenedores, redes y volúmenes
docker-compose down -v

# Eliminar imágenes también
docker-compose down --rmi all -v
```

## 📝 Notas Importantes

1. **Variables de Entorno**: El frontend necesita `VITE_API_URL` en tiempo de build. Si cambias la URL del backend, necesitas reconstruir el frontend.

2. **Puertos**: Asegúrate de que los puertos no estén en uso:
   ```bash
   sudo netstat -tlnp | grep :3000
   sudo netstat -tlnp | grep :80
   ```

3. **Permisos**: Si tienes problemas con permisos, verifica:
   ```bash
   sudo chown -R $USER:$USER .
   ```

4. **Firewall**: Asegúrate de abrir los puertos necesarios:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 3000/tcp
   ```

## 🎯 Próximos Pasos

- [ ] Agregar base de datos MySQL/PostgreSQL
- [ ] Configurar SSL/HTTPS con Let's Encrypt
- [ ] Agregar Redis para cache
- [ ] Configurar backups automáticos
- [ ] Agregar monitoreo (Prometheus, Grafana)
- [ ] Configurar CI/CD con GitHub Actions
