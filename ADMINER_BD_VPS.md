# 🔍 Conectar Adminer a la BD del VPS

## 📋 Datos para Adminer

Cuando abres http://localhost:8080, usa estos datos:

### Campos del Formulario:

1. **Sistema**: `PostgreSQL`
2. **Servidor**: `89.117.33.122:5433` ⚠️ (IP del VPS + puerto)
3. **Usuario**: `unikuo_user`
4. **Contraseña**: `tu_password_del_vps` (la que tienes en el VPS)
5. **Base de datos**: `unikuo_plataform`

### Ejemplo Visual:

```
┌─────────────────────────────────┐
│ Sistema: PostgreSQL              │
│                                 │
│ Servidor: 89.117.33.122:5433   │ ← IP del VPS + puerto
│ Usuario:   unikuo_user          │
│ Contraseña: [tu_password]       │
│ Base de datos: unikuo_plataform │
│                                 │
│ [Iniciar sesión]                │
└─────────────────────────────────┘
```

## ⚠️ Importante

- **Servidor**: Debe ser `89.117.33.122:5433` (NO solo `database`)
- **Puerto**: `5433` (el puerto expuesto en el VPS)
- **No uses**: `database` como servidor (ese es el contenedor local)

## 🔍 Verificar que Funciona

Después de conectarte, deberías ver:
- Todas las tablas de la BD del VPS
- Los datos reales
- Puedes crear/modificar tablas directamente

## 🆘 Si No Funciona

### Error: "Connection refused"

1. Verifica que el VPS tenga el puerto 5433 abierto
2. Verifica que Docker en el VPS esté corriendo:
   ```bash
   # En el VPS
   docker compose ps
   ```

### Error: "Password authentication failed"

- Verifica la contraseña (debe ser la misma que en el VPS)
- Verifica el usuario: `unikuo_user`

### Error: "Could not connect to server"

- Verifica que el firewall del VPS permita conexiones al puerto 5433
- Verifica que la IP del VPS sea correcta: `89.117.33.122`
