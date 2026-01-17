# Unikuo Platform

Plataforma estilo Shopify para crear tiendas online fácilmente.

## 🚀 Estructura del Proyecto

```
unikuo_plataform/
├── backend/              # Backend Node.js + Express
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/             # Frontend React + TypeScript + Vite
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── docker-compose.yml    # Orquestación de servicios Docker
├── .env.example          # Variables de entorno de ejemplo
└── README.md
```

## 📋 Requisitos Previos

- Node.js (v18 o superior) - Para desarrollo local
- Docker y Docker Compose - Para producción y despliegue
- Git - Para control de versiones

## ⚡ Inicio Rápido

**📖 Para instrucciones detalladas, ver: [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)**

### Desarrollo Local

**Con Docker (Recomendado):**
```bash
docker compose up -d
# Acceder a: http://localhost
```

**Sin Docker:**
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev
```

### Verificar en VPS
```bash
ssh root@89.117.33.122
cd /root/unikuo_plataform
docker compose ps
# Acceder a: http://89.117.33.122
```

## 🛠️ Instalación Completa

Ver [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) para instrucciones detalladas.

## 🏃 Desarrollo Local

### Sin Docker

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🧪 Probar la Conexión

1. Asegúrate de que ambos servicios estén corriendo
2. Abre el navegador en:
   - **Local**: `http://localhost:5173` (desarrollo) o `http://localhost` (Docker)
   - **VPS**: `http://TU_IP_O_DOMINIO`
3. Haz clic en "Probar Conexión" para verificar que el frontend se conecta correctamente con el backend

## 📦 Producción

### Build del Frontend

```bash
cd frontend
npm run build
```

Los archivos compilados estarán en la carpeta `frontend/dist/`

### Ejecutar Backend en Producción

```bash
cd backend
npm start
```

### Con Docker

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Verificar estado
docker-compose ps
```

## 🌐 Despliegue en VPS

### Con Docker (Recomendado)

1. **Instalar Docker en el VPS:**
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
```

2. **Subir el proyecto al VPS** (Git, SCP, etc.)

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
nano .env  # Editar con tus valores de producción
```

4. **Construir y ejecutar:**
```bash
docker-compose build
docker-compose up -d
```

5. **Verificar:**
```bash
docker-compose ps
docker-compose logs -f
```

### Sin Docker (PM2 + Nginx)

Ver la guía completa en `GUIA_VPS_HOSTINGER.md`

## 📡 Endpoints del API

### Test
- `GET /api/test` - Endpoint de prueba básico
- `GET /api/test/health` - Health check

## 📚 Documentación

- **`INICIO_RAPIDO.md`** - Guía rápida para empezar
- **`ACTUALIZAR_VPS.md`** - Cómo actualizar el proyecto en el VPS
- **`MIGRACIONES_BASE_DATOS.md`** - Sistema de migraciones de base de datos
- **`AUTENTICACION_SETUP.md`** - Documentación del sistema de autenticación
- **`DOCKER_DESARROLLO_HOT_RELOAD.md`** - Desarrollo con Docker y hot reload
- **`DOCKER_EN_VPS.md`** - Gestión de Docker en el VPS
- **`FLUJO_TRABAJO_DIARIO.md`** - Flujo de trabajo diario recomendado

## 🏗️ Próximos Pasos

- [x] Backend básico funcionando
- [x] Frontend conectado al backend
- [x] Docker configurado
- [x] Base de datos PostgreSQL configurada
- [x] Sistema de autenticación y roles
- [ ] CRUD de tiendas
- [ ] Sistema de plantillas
- [ ] Gestión de productos
- [ ] Sistema de pagos
- [ ] Panel de administración

## 📝 Notas

- El backend usa Node.js con Express
- El frontend usa React con TypeScript y Vite
- Docker está configurado para facilitar el despliegue
- CORS está configurado para permitir conexiones desde el frontend
- El proyecto está preparado para escalar fácilmente

## 🐛 Solución de Problemas

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo
2. Verifica las variables de entorno (especialmente `VITE_API_URL`)
3. Revisa la configuración de CORS en `backend/src/middleware/cors.js`
4. Si usas Docker, verifica que ambos contenedores estén corriendo: `docker-compose ps`

### Error de CORS

- Verifica que `ALLOWED_ORIGINS` en `.env` incluya la URL del frontend
- En desarrollo, CORS permite cualquier origen por defecto

### Docker no inicia

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

## 📞 Soporte

Para más información, consulta la documentación en los archivos `.md` del proyecto.
