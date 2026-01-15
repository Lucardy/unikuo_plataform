# Dockerfile para el Frontend (React + Vite)

# Etapa 1: Build
FROM node:18-alpine AS builder

# Argumento para la URL del API (se pasa desde docker-compose)
ARG VITE_API_URL=http://localhost:3000

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Establecer variable de entorno para el build
ENV VITE_API_URL=${VITE_API_URL}

# Build de la aplicación
RUN npm run build

# Etapa 2: Production (servir archivos estáticos con Nginx)
FROM nginx:alpine

# Copiar archivos compilados desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Nginx se inicia automáticamente
