# 🚀 Flujo de Trabajo Diario - Desarrollo

## 📋 Inicio del Día

### 1. Abrir Docker Desktop
- Abre la aplicación **Docker Desktop**
- Espera a que aparezca "Docker Desktop is running"
- **No necesitas hacer nada más en la interfaz**

### 2. Abrir Terminal en tu Proyecto
```bash
cd C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform
```

### 3. Iniciar Todo con Hot Reload
```bash
npm run docker:dev
```

**O directamente:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 4. Verificar que Todo Esté Corriendo
```bash
docker compose -f docker-compose.dev.yml ps
```

Deberías ver:
- ✅ `unikuo-backend-dev` - Up (healthy)
- ✅ `unikuo-database-dev` - Up (healthy)
- ✅ `unikuo-frontend-dev` - Up

### 5. Abrir en el Navegador
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api/test

---

## 💻 Trabajar Normalmente

### Hacer Cambios

**Frontend:**
- Edita archivos en `frontend/src/`
- Guarda (Ctrl+S)
- **Los cambios se ven automáticamente** en http://localhost:5173 ✨

**Backend:**
- Edita archivos en `backend/src/`
- Guarda (Ctrl+S)
- **El servidor se reinicia automáticamente** (hot reload) ✨

**Base de Datos:**
- Los cambios en datos se ven inmediatamente
- Cambios en esquema requieren reiniciar: `docker compose -f docker-compose.dev.yml restart database`

---

## 📊 Ver Logs (Opcional)

Si quieres ver qué está pasando:

```bash
# Ver logs del frontend
docker compose -f docker-compose.dev.yml logs -f frontend

# Ver logs del backend
docker compose -f docker-compose.dev.yml logs -f backend

# Ver logs de todos
docker compose -f docker-compose.dev.yml logs -f
```

**Salir de los logs:** Presiona `Ctrl+C`

---

## 🛑 Fin del Día

### Detener Todo
```bash
npm run docker:down:dev
```

**O directamente:**
```bash
docker compose -f docker-compose.dev.yml down
```

**Nota:** Esto detiene los contenedores pero **NO borra los datos** de la base de datos.

---

## 🔄 Resumen de Comandos Diarios

### Iniciar Trabajo
```bash
npm run docker:dev
```

### Ver Estado
```bash
docker compose -f docker-compose.dev.yml ps
```

### Ver Logs
```bash
docker compose -f docker-compose.dev.yml logs -f
```

### Detener Todo
```bash
npm run docker:down:dev
```

---

## 🎯 Flujo Completo (Copy-Paste)

```bash
# 1. Abrir Docker Desktop (una vez al día)

# 2. Abrir terminal y navegar al proyecto
cd C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform

# 3. Iniciar todo
npm run docker:dev

# 4. Verificar
docker compose -f docker-compose.dev.yml ps

# 5. Trabajar normalmente
# - Editar código
# - Guardar
# - Ver cambios automáticamente

# 6. Al terminar
npm run docker:down:dev
```

---

## ⚡ Comandos Rápidos (Scripts)

Ya están configurados en `package.json`:

```bash
npm run docker:dev        # Iniciar desarrollo (hot reload)
npm run docker:down:dev  # Detener desarrollo
npm run docker:logs:dev  # Ver logs desarrollo
npm run docker:prod      # Iniciar producción (build final)
npm run docker:down      # Detener producción
npm run docker:logs      # Ver logs producción
```

---

## 🆘 Si Algo No Funciona

### Verificar Docker Desktop
- Asegúrate que esté corriendo
- Debería decir "Docker Desktop is running"

### Ver Logs de Errores
```bash
docker compose -f docker-compose.dev.yml logs
```

### Reiniciar Todo
```bash
# Detener
npm run docker:down:dev

# Iniciar de nuevo
npm run docker:dev
```

### Si los Cambios No Se Ven
```bash
# Verificar que estés usando el archivo correcto
docker compose -f docker-compose.dev.yml ps

# Verificar logs
docker compose -f docker-compose.dev.yml logs frontend
docker compose -f docker-compose.dev.yml logs backend
```

---

## 📝 Checklist Diario

- [ ] Docker Desktop abierto y corriendo
- [ ] Terminal en la carpeta del proyecto
- [ ] Ejecutar `npm run docker:dev`
- [ ] Verificar con `docker compose -f docker-compose.dev.yml ps`
- [ ] Abrir http://localhost:5173
- [ ] ¡Trabajar! 🎉

---

## 💡 Tips

1. **Docker Desktop:** Solo necesitas abrirlo una vez al día
2. **Hot Reload:** Funciona automáticamente, no necesitas hacer nada
3. **Logs:** Úsalos solo si hay problemas o quieres ver qué pasa
4. **Detener:** Al final del día, detén todo para liberar recursos

---

## 🎬 Ejemplo Real

```bash
# Lunes por la mañana
PS> cd C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform
PS> npm run docker:dev
# Esperar 10-15 segundos
PS> docker compose -f docker-compose.dev.yml ps
# Ver que todo está "Up"
# Abrir http://localhost:5173
# Trabajar todo el día...

# Lunes por la noche
PS> npm run docker:down:dev
# Listo!
```

**Así de simple.** 🚀
