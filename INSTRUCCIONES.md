# 🚀 Instrucciones Rápidas - Unikuo Platform

## ⚡ Inicio Rápido

### 1. Instalar Dependencias

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 2. Iniciar los Servidores

**Terminal 1 - Backend:**
```bash
npm run server
```
O directamente:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 3. Probar la Conexión

1. Abre tu navegador en `http://localhost:5173`
2. Verás un componente de prueba de conexión
3. Haz clic en "Probar Conexión"
4. Deberías ver un mensaje de éxito ✅

## 🔧 Configuración

### Variables de Entorno

**Frontend** (opcional, tiene valores por defecto):
- Crea `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000
```

**Backend** (opcional, tiene valores por defecto):
- Crea `server/.env`:
```env
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## 📡 Endpoints Disponibles

- `GET http://localhost:3000/` - Información del API
- `GET http://localhost:3000/api/test` - Prueba de conexión
- `GET http://localhost:3000/api/test/health` - Health check

## 🌐 Preparación para VPS

### 1. Build del Frontend
```bash
npm run build
```

### 2. Configurar Variables de Entorno en VPS

**Frontend `.env`:**
```env
VITE_API_URL=http://tu-vps-ip:3000
```

**Backend `server/.env`:**
```env
PORT=3000
NODE_ENV=production
API_URL=http://tu-vps-ip:3000
FRONTEND_URL=http://tu-vps-ip
ALLOWED_ORIGINS=http://tu-vps-ip,http://tu-dominio.com
```

### 3. Subir al VPS

1. Sube todos los archivos al VPS
2. Instala dependencias en el VPS
3. Ejecuta el build del frontend
4. Inicia el backend con PM2 o similar:
```bash
cd server
npm start
```

### 4. Configurar Nginx (Recomendado)

Ejemplo de configuración nginx:

```nginx
# Frontend
server {
    listen 80;
    server_name tu-dominio.com;
    
    root /ruta/a/unikuo_plataform/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 80;
    server_name api.tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ✅ Checklist de Pruebas

- [ ] Backend inicia correctamente en `http://localhost:3000`
- [ ] Frontend inicia correctamente en `http://localhost:5173`
- [ ] El botón "Probar Conexión" funciona
- [ ] El health check funciona
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la consola del servidor

## 🐛 Solución de Problemas

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo en el puerto 3000
2. Verifica que no haya errores en la consola del backend
3. Revisa la configuración de CORS en `server/src/middleware/cors.js`
4. Verifica que la URL en `src/config/api.ts` sea correcta

### Error de CORS

- En desarrollo, el CORS está configurado para permitir cualquier origen
- En producción, asegúrate de agregar tu dominio a `ALLOWED_ORIGINS` en el `.env` del backend

### El backend no inicia

1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que las dependencias estén instaladas: `cd server && npm install`
3. Revisa los logs de error en la consola

## 📝 Próximos Pasos

Una vez que verifiques que todo funciona:

1. ✅ Backend básico funcionando
2. ✅ Frontend conectado al backend
3. ⏭️ Configurar base de datos
4. ⏭️ Sistema de autenticación
5. ⏭️ CRUD de tiendas
6. ⏭️ Sistema de plantillas
