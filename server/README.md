# Backend - Unikuo Platform

Backend en Node.js con Express para la plataforma Unikuo.

## Instalación

```bash
cd server
npm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus configuraciones (opcional en desarrollo).

## Desarrollo

Para ejecutar en modo desarrollo con auto-reload:
```bash
npm run dev
```

## Producción

Para ejecutar en producción:
```bash
npm start
```

## Endpoints

### Test
- `GET /api/test` - Endpoint de prueba básico
- `GET /api/test/health` - Health check

## Estructura

```
server/
├── src/
│   ├── config/
│   │   └── config.js          # Configuración
│   ├── middleware/
│   │   └── cors.js             # Configuración CORS
│   ├── routes/
│   │   └── test.routes.js      # Rutas de prueba
│   └── index.js                # Punto de entrada
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```
