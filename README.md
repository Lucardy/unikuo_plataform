# Unikuo Platform

Plataforma estilo Shopify para crear tiendas online fácilmente.

## 🚀 Estructura del Proyecto

```
unikuo_plataform/
├── server/          # Backend en Node.js + Express
├── src/             # Frontend en React + TypeScript + Vite
└── public/          # Archivos estáticos
```

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn

## 🛠️ Instalación

### 1. Instalar dependencias del frontend

```bash
npm install
```

### 2. Instalar dependencias del backend

```bash
cd server
npm install
cd ..
```

## 🏃 Desarrollo Local

### Iniciar el Backend

En una terminal:

```bash
cd server
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### Iniciar el Frontend

En otra terminal:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🧪 Probar la Conexión

1. Asegúrate de que ambos servidores estén corriendo
2. Abre el navegador en `http://localhost:5173`
3. Haz clic en "Probar Conexión" para verificar que el frontend se conecta correctamente con el backend

## 📦 Producción

### Build del Frontend

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Ejecutar Backend en Producción

```bash
cd server
npm start
```

## 🌐 Configuración para VPS

### Variables de Entorno

#### Frontend (.env)

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://tu-vps-ip:3000
# O si tienes dominio:
# VITE_API_URL=https://api.tu-dominio.com
```

#### Backend (server/.env)

Crea un archivo `.env` en la carpeta `server/`:

```env
PORT=3000
NODE_ENV=production
API_URL=http://tu-vps-ip:3000
FRONTEND_URL=http://tu-vps-ip:5173
# O si tienes dominio:
# API_URL=https://api.tu-dominio.com
# FRONTEND_URL=https://tu-dominio.com
```

### Desplegar en VPS

1. Sube los archivos del proyecto al VPS
2. Instala las dependencias (tanto frontend como backend)
3. Configura las variables de entorno
4. Ejecuta el build del frontend: `npm run build`
5. Inicia el backend: `cd server && npm start`
6. Configura un servidor web (nginx) para servir el frontend y hacer proxy al backend
7. Configura PM2 o similar para mantener el backend corriendo

## 📡 Endpoints del API

### Test
- `GET /api/test` - Endpoint de prueba básico
- `GET /api/test/health` - Health check

## 🏗️ Próximos Pasos

- [ ] Configurar base de datos (MySQL/PostgreSQL)
- [ ] Sistema de autenticación
- [ ] CRUD de tiendas
- [ ] Sistema de plantillas
- [ ] Gestión de productos
- [ ] Sistema de pagos
- [ ] Panel de administración

## 📝 Notas

- El backend usa Node.js con Express
- El frontend usa React con TypeScript y Vite
- CORS está configurado para permitir conexiones desde el frontend
- El proyecto está preparado para escalar fácilmente
