# 🐳 Docker en el VPS - Guía Rápida

## ¿Cómo Funciona en el VPS?

En el VPS **NO hay Docker Desktop** (es Linux). Docker se ejecuta directamente como servicio del sistema.

**Es incluso MÁS simple que en local:**
- ✅ No necesitas abrir ninguna aplicación
- ✅ Docker siempre está corriendo
- ✅ Solo usas comandos en la terminal

---

## 🚀 Iniciar el Proyecto en el VPS

### Paso 1: Conectarse al VPS
```bash
ssh root@89.117.33.122
```

### Paso 2: Ir al directorio del proyecto
```bash
cd /root/unikuo_plataform
```

### Paso 3: Iniciar todo
```bash
docker compose up -d
```

**¡Eso es todo!** Los 3 servicios (frontend, backend, base de datos) se inician automáticamente.

### Paso 4: Verificar que esté corriendo
```bash
docker compose ps
```

Deberías ver:
```
NAME              STATUS
unikuo-backend    Up (healthy)
unikuo-database   Up (healthy)
unikuo-frontend   Up (healthy)
```

---

## 🔄 Flujo Automático (Ya Configurado)

**Lo mejor de todo:** Ya tienes **GitHub Actions** configurado, así que:

1. **Haces cambios en local**
2. **Haces push a GitHub:**
   ```bash
   git add .
   git commit -m "Mis cambios"
   git push origin main
   ```
3. **GitHub Actions automáticamente:**
   - Se conecta al VPS
   - Hace `git pull`
   - Reconstruye las imágenes Docker
   - Reinicia los servicios
4. **¡Listo!** Tus cambios ya están en el VPS

**No necesitas hacer nada manualmente en el VPS.** 🎉

---

## 🛠️ Comandos Útiles en el VPS

### Ver estado de los servicios
```bash
docker compose ps
```

### Ver logs
```bash
# Todos los servicios
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Solo base de datos
docker compose logs -f database
```

### Reiniciar servicios
```bash
# Todos
docker compose restart

# Solo uno
docker compose restart backend
```

### Detener servicios
```bash
docker compose down
```

### Actualizar manualmente (si GitHub Actions falla)
```bash
cd /root/unikuo_plataform
git pull origin main
docker compose build
docker compose up -d
```

---

## 📊 Verificar que Todo Funciona

### 1. Ver servicios corriendo
```bash
docker compose ps
```

### 2. Probar en el navegador
- Frontend: http://89.117.33.122
- Backend API: http://89.117.33.122:3001/api/test

### 3. Ver logs si hay problemas
```bash
docker compose logs backend | tail -30
```

---

## 🔍 Diferencias: Local vs VPS

### Local (Windows con Docker Desktop)
```bash
# 1. Abrir Docker Desktop (aplicación gráfica)
# 2. Abrir terminal
docker compose up -d
```

### VPS (Linux)
```bash
# 1. Conectarse por SSH
ssh root@89.117.33.122

# 2. Ejecutar comando (Docker ya está corriendo)
docker compose up -d
```

**En el VPS es más directo:** No necesitas abrir ninguna aplicación, Docker siempre está disponible.

---

## ⚡ Comandos Rápidos de Referencia

```bash
# Conectarse al VPS
ssh root@89.117.33.122

# Ir al proyecto
cd /root/unikuo_plataform

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f

# Reiniciar
docker compose restart

# Actualizar (manual)
git pull origin main
docker compose build
docker compose up -d
```

---

## 🎯 Resumen

**En el VPS:**
- ✅ Docker siempre está corriendo (no necesitas abrir nada)
- ✅ Solo usas comandos en la terminal
- ✅ GitHub Actions hace el despliegue automático
- ✅ Es incluso más simple que en local

**Flujo típico:**
1. Trabajas en local
2. Haces `git push`
3. GitHub Actions despliega automáticamente
4. Verificas en http://89.117.33.122

**Solo necesitas conectarte al VPS si:**
- Quieres ver logs
- Verificar estado
- Hacer algo manual (raro)

---

## 🆘 Solución de Problemas

### "docker compose: command not found"
```bash
# Verificar que Docker esté instalado
docker --version
docker compose version
```

### "Permission denied"
```bash
# Asegúrate de estar como root o usar sudo
sudo docker compose up -d
```

### "Port already in use"
```bash
# Ver qué está usando el puerto
sudo lsof -i :3000
sudo lsof -i :5432

# O cambiar puerto en docker-compose.yml
```

---

## 💡 Recomendación

**Para el día a día:**
- Trabaja en local normalmente
- Haz `git push` cuando termines
- GitHub Actions se encarga del resto
- Solo conecta al VPS si necesitas verificar algo específico

**Es así de simple:** Push y listo. 🚀
