# 🐳 Cómo Usar Docker Desktop - Guía Práctica

## ¿Qué es Docker Desktop?

Docker Desktop es la aplicación que instala Docker en Windows/Mac. Es la **interfaz gráfica** que te permite:
- Ver contenedores corriendo
- Ver imágenes
- Ver logs
- Gestionar volúmenes

**PERO** para trabajar con tu proyecto, **NO** es tan simple como darle "play" a cada servicio. Necesitas usar la **terminal** con comandos.

---

## ✅ Cómo Funciona Realmente

### Paso 1: Asegúrate que Docker Desktop esté corriendo

1. Abre **Docker Desktop** (la aplicación)
2. Espera a que aparezca "Docker Desktop is running" en la barra de tareas
3. **No necesitas hacer nada más en la interfaz gráfica**

### Paso 2: Usa la Terminal (PowerShell o CMD)

Abre PowerShell o CMD en la carpeta de tu proyecto:

```bash
cd C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform
```

### Paso 3: Ejecuta Docker Compose

```bash
# Iniciar todos los servicios (frontend, backend, base de datos)
docker compose up -d
```

**Eso es todo.** Con ese comando:
- ✅ Construye las imágenes si no existen
- ✅ Inicia los 3 contenedores (frontend, backend, database)
- ✅ Los conecta entre sí
- ✅ Configura la red interna

### Paso 4: Verificar que todo esté corriendo

```bash
docker compose ps
```

Deberías ver algo como:
```
NAME              STATUS
unikuo-backend    Up (healthy)
unikuo-database   Up (healthy)
unikuo-frontend   Up (healthy)
```

---

## 🎯 Flujo de Trabajo Diario

### Iniciar el proyecto:
```bash
docker compose up -d
```

### Ver logs (opcional):
```bash
docker compose logs -f
```

### Detener el proyecto:
```bash
docker compose down
```

### Reiniciar después de cambios:
```bash
# Si cambiaste código del backend o frontend
docker compose build
docker compose up -d
```

---

## 🖥️ ¿Qué Puedes Ver en Docker Desktop?

Una vez que ejecutas `docker compose up -d`, puedes abrir Docker Desktop y verás:

### En la pestaña "Containers":
- `unikuo-backend` - Estado: Running
- `unikuo-database` - Estado: Running  
- `unikuo-frontend` - Estado: Running

### Puedes hacer clic en cada uno para:
- Ver logs
- Ver estadísticas (CPU, memoria)
- Abrir terminal dentro del contenedor
- Detener/Iniciar/Reiniciar

**PERO** para iniciar todo el proyecto, siempre usa la terminal con `docker compose up -d`.

---

## ❌ Lo que NO Funciona

### ❌ NO puedes:
- Darle "play" a cada servicio individualmente desde Docker Desktop
- Iniciar el proyecto completo desde la interfaz gráfica
- Configurar docker-compose desde Docker Desktop

### ✅ SÍ puedes:
- Ver los contenedores corriendo
- Ver logs de cada contenedor
- Detener/Iniciar contenedores individuales (pero no es recomendado)
- Ver uso de recursos

---

## 🔄 Comparación: Con vs Sin Docker Desktop

### Con Docker Desktop (lo que tienes):
```bash
# Terminal
docker compose up -d
```
- ✅ Todo se inicia junto
- ✅ Servicios conectados automáticamente
- ✅ Fácil de gestionar

### Sin Docker Desktop (manual):
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev

# Terminal 3 (o Docker solo para BD)
docker compose up -d database
```
- ❌ Más complejo
- ❌ Múltiples terminales
- ❌ Más propenso a errores

---

## 💡 Recomendación

**Para desarrollo diario:**

1. Abre Docker Desktop (solo para que Docker esté corriendo)
2. Usa la terminal para trabajar:
   ```bash
   docker compose up -d        # Iniciar
   docker compose logs -f      # Ver logs
   docker compose down         # Detener
   ```

3. Trabaja en tu código normalmente
4. Si cambias código, reconstruye:
   ```bash
   docker compose build
   docker compose up -d
   ```

---

## 🎬 Ejemplo Completo de Sesión de Trabajo

```bash
# 1. Abrir Docker Desktop (solo una vez al día)

# 2. Abrir terminal en tu proyecto
cd C:\Users\lucka\OneDrive\Programacion\React\unikuo_plataform

# 3. Iniciar todo
docker compose up -d

# 4. Verificar que esté corriendo
docker compose ps

# 5. Trabajar en tu código (VS Code, etc.)

# 6. Si cambias código del backend/frontend, reconstruir:
docker compose build frontend
docker compose build backend
docker compose up -d

# 7. Al terminar, detener:
docker compose down
```

---

## 🆘 Solución de Problemas

### "Docker Desktop is not running"
- Abre Docker Desktop
- Espera a que aparezca "Docker Desktop is running"

### "docker compose: command not found"
- Asegúrate de usar `docker compose` (con espacio)
- O instala Docker Compose v2

### "Port already in use"
- Algo más está usando el puerto
- Cambia el puerto en `docker-compose.yml` o `.env`

---

## 📝 Resumen

**Docker Desktop = Aplicación que corre Docker**
- Solo necesitas que esté abierta y corriendo
- No la uses para iniciar el proyecto

**Terminal = Donde trabajas realmente**
- `docker compose up -d` = Iniciar todo
- `docker compose down` = Detener todo
- `docker compose ps` = Ver estado

**Es así de simple:** Un comando para iniciar, un comando para detener. 🚀
