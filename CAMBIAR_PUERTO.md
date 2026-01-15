# 🔧 Cambiar Puerto del Backend

## Problema

El puerto 3000 está siendo usado por otro proyecto (whatsapp-bot).

## ✅ Solución: Usar Puerto 3001

### Paso 1: Ir al directorio correcto

```bash
cd /root/unikuo_plataform
```

### Paso 2: Editar .env

```bash
nano .env
```

Cambiar a:
```env
NODE_ENV=production
BACKEND_PORT=3001
FRONTEND_PORT=80
API_URL=http://89.117.33.122:3001
FRONTEND_URL=http://89.117.33.122
ALLOWED_ORIGINS=http://89.117.33.122
```

Guarda: `Ctrl+O`, `Enter`, `Ctrl+X`

### Paso 3: Detener servicios antiguos (si existen)

```bash
docker compose down
```

### Paso 4: Iniciar servicios con el nuevo puerto

```bash
docker compose up -d
```

### Paso 5: Verificar

```bash
docker compose ps
```

Deberías ver:
```
NAME              STATUS          PORTS
unikuo-backend    Up X seconds    0.0.0.0:3001->3000/tcp
unikuo-frontend   Up X seconds    0.0.0.0:80->80/tcp
```

### Paso 6: Probar

1. Backend directo: `http://89.117.33.122:3001/api/test`
2. Frontend: `http://89.117.33.122` (debería conectarse al backend en 3001)

---

## ✅ Listo

Ahora el backend usa el puerto 3001 y no entra en conflicto con tu otro proyecto.
