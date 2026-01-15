# 💻 Desarrollo Frontend - Ver Cambios en Tiempo Real

## 🔴 Problema

Cuando usas Docker, el frontend se **compila** y se sirve como archivos estáticos. Los cambios **NO se reflejan automáticamente**.

## ✅ Solución: Dos Opciones

### Opción 1: Desarrollo Sin Docker (Recomendado) ⚡

**Ideal para desarrollo diario** - Ver cambios instantáneamente.

#### Pasos:

**1. Detener solo el frontend de Docker:**
```bash
docker compose stop frontend
```

**2. Ejecutar el frontend en modo desarrollo:**
```bash
cd frontend
npm install  # Solo la primera vez
npm run dev
```

**3. El frontend estará en:** http://localhost:5173

**4. Mantener backend y base de datos con Docker:**
```bash
# En otra terminal, solo inicia backend y database
docker compose up -d backend database
```

**Ventajas:**
- ✅ Cambios se ven **instantáneamente** (hot reload)
- ✅ No necesitas reconstruir Docker
- ✅ Más rápido para desarrollo

---

### Opción 2: Reconstruir Docker (Para Producción) 🐳

**Ideal cuando quieres probar el build final.**

#### Pasos:

**1. Reconstruir solo el frontend:**
```bash
docker compose build frontend
docker compose up -d frontend
```

**2. Esperar a que termine el build (puede tardar 1-2 minutos)**

**3. Recargar el navegador** (puede necesitar Ctrl+F5 para limpiar caché)

**Desventajas:**
- ❌ Tarda más (1-2 minutos por cambio)
- ❌ No es ideal para desarrollo rápido

---

## 🎯 Recomendación para Desarrollo

### Configuración Ideal:

**Terminal 1 - Backend y Base de Datos (Docker):**
```bash
docker compose up -d backend database
```

**Terminal 2 - Frontend (Modo Desarrollo):**
```bash
cd frontend
npm run dev
```

**Resultado:**
- Backend: http://localhost:3000 (Docker)
- Frontend: http://localhost:5173 (Desarrollo con hot reload)
- Base de datos: Docker

**Ventajas:**
- ✅ Cambios en frontend se ven **instantáneamente**
- ✅ Backend y BD siguen en Docker (más estable)
- ✅ Mejor experiencia de desarrollo

---

## 🔧 Configurar Frontend para Desarrollo

### 1. Asegúrate que el frontend apunte al backend correcto

En `frontend/.env` o `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:3000
```

### 2. Si el backend está en otro puerto

Si tu backend Docker está en puerto 3001:
```env
VITE_API_URL=http://localhost:3001
```

---

## 📝 Flujo de Trabajo Recomendado

### Durante Desarrollo:

```bash
# Terminal 1: Backend y BD con Docker
docker compose up -d backend database

# Terminal 2: Frontend en modo desarrollo
cd frontend
npm run dev
```

**Trabajas normalmente:**
- Cambias código en `frontend/src/`
- Cambios se ven **automáticamente** en http://localhost:5173
- No necesitas reconstruir nada

### Antes de Hacer Push:

```bash
# Probar que el build funciona
cd frontend
npm run build

# Si todo está bien, hacer push
git add .
git commit -m "Mis cambios"
git push origin main
```

---

## 🐛 Solución de Problemas

### "Cannot connect to backend"

**Problema:** El frontend en desarrollo no puede conectar al backend.

**Solución:**
1. Verifica que el backend esté corriendo:
   ```bash
   docker compose ps
   ```

2. Verifica la URL en `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Verifica CORS en el backend (debería permitir localhost:5173)

### "Port 5173 already in use"

**Solución:**
```bash
# Ver qué está usando el puerto
# Windows:
netstat -ano | findstr :5173

# O cambiar el puerto en vite.config.ts
```

### Cambios no se ven en Docker

**Solución:**
```bash
# Reconstruir el frontend
docker compose build frontend --no-cache
docker compose up -d frontend

# Limpiar caché del navegador (Ctrl+F5)
```

---

## 📊 Comparación

| Método | Velocidad | Hot Reload | Ideal Para |
|--------|-----------|------------|------------|
| **Frontend sin Docker** | ⚡⚡⚡ Rápido | ✅ Sí | Desarrollo diario |
| **Todo con Docker** | 🐌 Lento | ❌ No | Probar build final |

---

## 🎬 Ejemplo Completo

```bash
# 1. Iniciar backend y BD con Docker
docker compose up -d backend database

# 2. Verificar que estén corriendo
docker compose ps

# 3. En otra terminal, iniciar frontend en desarrollo
cd frontend
npm run dev

# 4. Abrir navegador en http://localhost:5173

# 5. Hacer cambios en App.tsx, guardar
# 6. Ver cambios automáticamente en el navegador ✨

# 7. Al terminar, detener frontend (Ctrl+C)
# 8. Backend y BD siguen corriendo en Docker
```

---

## 💡 Resumen

**Para desarrollo rápido:**
- ✅ Backend y BD: Docker
- ✅ Frontend: `npm run dev` (sin Docker)
- ✅ Cambios instantáneos

**Para probar producción:**
- ✅ Todo con Docker
- ✅ Reconstruir después de cambios
