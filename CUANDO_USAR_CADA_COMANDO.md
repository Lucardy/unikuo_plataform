# 🎯 Cuándo Usar Cada Comando Docker

## 📋 Resumen Rápido

Tienes **DOS archivos** de configuración:

1. **`docker-compose.yml`** → Producción (build final, sin hot reload)
2. **`docker-compose.dev.yml`** → Desarrollo (con hot reload)

---

## 🚀 Comandos Disponibles

### Para Desarrollo (Hot Reload) 🔥

```bash
docker compose -f docker-compose.dev.yml up -d
```

**Usa cuando:**
- ✅ Estás desarrollando activamente
- ✅ Quieres ver cambios instantáneos
- ✅ Trabajas en backend o frontend

### Para Producción (Build Final) 🐳

```bash
docker compose up -d
```

**Usa cuando:**
- ✅ Quieres probar el build final
- ✅ Antes de hacer push
- ✅ Probar cómo se verá en el VPS

---

## 💡 Recomendación: Crear Scripts

Para hacerlo más fácil, puedes agregar scripts al `package.json`:

```json
{
  "scripts": {
    "docker:dev": "docker compose -f docker-compose.dev.yml up -d",
    "docker:prod": "docker compose up -d",
    "docker:down": "docker compose down",
    "docker:logs": "docker compose logs -f"
  }
}
```

Luego solo usas:
```bash
npm run docker:dev    # Desarrollo con hot reload
npm run docker:prod   # Producción
npm run docker:down   # Detener
```

---

## 🎬 Flujo de Trabajo Recomendado

### Desarrollo Diario:

```bash
# Iniciar en modo desarrollo
docker compose -f docker-compose.dev.yml up -d

# Trabajar normalmente
# Cambios se ven instantáneamente ✨

# Al terminar
docker compose -f docker-compose.dev.yml down
```

### Antes de Push:

```bash
# Probar build final
docker compose down  # Detener desarrollo
docker compose build
docker compose up -d

# Verificar que todo funciona
# Luego hacer push
git add .
git commit -m "Mis cambios"
git push origin main
```

---

## 🔄 ¿Cuál Usar?

| Situación | Comando |
|-----------|---------|
| **Desarrollo activo** | `docker compose -f docker-compose.dev.yml up -d` |
| **Probar build final** | `docker compose up -d` |
| **VPS (producción)** | `docker compose up -d` (siempre) |

---

## ⚠️ Importante

**No mezcles ambos:**
- Si tienes `docker-compose.yml` corriendo, deténlo antes de iniciar `docker-compose.dev.yml`
- Y viceversa

**Detener antes de cambiar:**
```bash
# Detener el que está corriendo
docker compose down
# O
docker compose -f docker-compose.dev.yml down

# Luego iniciar el otro
```

---

## 🎯 Respuesta Directa

**NO, no tienes que usar siempre `-f docker-compose.dev.yml`**

- **Para desarrollo:** `docker compose -f docker-compose.dev.yml up -d`
- **Para producción/VPS:** `docker compose up -d`

**O mejor aún:** Crea scripts en `package.json` para hacerlo más fácil. 🚀
