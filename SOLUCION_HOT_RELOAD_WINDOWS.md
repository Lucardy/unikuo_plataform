# 🔧 Solución: Hot Reload No Funciona en Windows

## 🔴 Problema

Los cambios en el código no se reflejan automáticamente. Tienes que reiniciar Docker para ver los cambios.

## ✅ Soluciones

### Solución 1: Polling Habilitado (Ya Configurado) ✅

He actualizado `vite.config.ts` para habilitar polling. Esto debería funcionar ahora.

**Prueba:**
1. Haz un cambio en `frontend/src/App.tsx`
2. Guarda (Ctrl+S)
3. Deberías ver el cambio automáticamente

### Solución 2: Si Aún No Funciona - Verificar Docker Desktop

**1. Verificar configuración de Docker Desktop:**

- Abre Docker Desktop
- Ve a Settings → General
- Asegúrate que "Use the WSL 2 based engine" esté habilitado (si tienes WSL)
- O desactívalo si no tienes WSL

**2. Verificar File Sharing:**

- Docker Desktop → Settings → Resources → File Sharing
- Asegúrate que `C:` esté compartido
- Si no, agrega `C:\Users` o la ruta completa de tu proyecto

### Solución 3: Usar Frontend Sin Docker (Más Confiable en Windows)

Si el hot reload sigue sin funcionar, usa el frontend sin Docker:

**Terminal 1 - Backend y BD con Docker:**
```bash
docker compose -f docker-compose.dev.yml up -d backend database
```

**Terminal 2 - Frontend sin Docker:**
```bash
cd frontend
npm run dev
```

**Ventajas:**
- ✅ Hot reload funciona perfectamente
- ✅ Más rápido
- ✅ Sin problemas de sincronización

**Desventajas:**
- ❌ Necesitas tener Node.js instalado localmente

### Solución 4: Verificar Volúmenes

**Verificar que los volúmenes estén montados:**
```bash
docker compose -f docker-compose.dev.yml exec frontend ls -la /app/src
```

Deberías ver tus archivos. Si no, el volumen no está montado correctamente.

**Reconstruir si es necesario:**
```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml build frontend
docker compose -f docker-compose.dev.yml up -d
```

---

## 🎯 Recomendación para Windows

**Para desarrollo en Windows, la mejor opción es:**

```bash
# Terminal 1: Backend y BD con Docker
docker compose -f docker-compose.dev.yml up -d backend database

# Terminal 2: Frontend sin Docker (hot reload perfecto)
cd frontend
npm run dev
```

**Ventajas:**
- ✅ Hot reload funciona 100%
- ✅ Sin problemas de sincronización
- ✅ Más rápido
- ✅ Mejor experiencia de desarrollo

---

## 🔍 Diagnosticar el Problema

### Ver si Vite detecta cambios:

```bash
docker compose -f docker-compose.dev.yml logs -f frontend
```

Luego haz un cambio y guarda. Deberías ver en los logs:
```
[vite] file changed: /app/src/App.tsx
```

Si no ves ese mensaje, Vite no está detectando los cambios.

### Verificar que el archivo cambió en el contenedor:

```bash
# Ver contenido del archivo en el contenedor
docker compose -f docker-compose.dev.yml exec frontend cat /app/src/App.tsx
```

Compara con tu archivo local. Si son diferentes, el volumen no está sincronizado.

---

## 💡 Alternativa: Usar WSL2

Si tienes WSL2 instalado, puedes trabajar desde WSL2 donde Docker funciona mejor:

```bash
# Desde WSL2
cd /mnt/c/Users/lucka/OneDrive/Programacion/React/unikuo_plataform
docker compose -f docker-compose.dev.yml up -d
```

El hot reload funciona mejor en WSL2 que en Windows nativo.

---

## 📝 Resumen

**Si el hot reload no funciona con Docker en Windows:**

1. ✅ **Primero:** Verifica que `vite.config.ts` tenga polling habilitado (ya está)
2. ✅ **Segundo:** Verifica File Sharing en Docker Desktop
3. ✅ **Mejor opción:** Usa frontend sin Docker para desarrollo

**Comando recomendado:**
```bash
# Backend/BD: Docker
docker compose -f docker-compose.dev.yml up -d backend database

# Frontend: Sin Docker (hot reload perfecto)
cd frontend
npm run dev
```
