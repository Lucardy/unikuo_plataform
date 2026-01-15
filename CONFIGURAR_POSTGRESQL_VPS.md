# ⚡ Configurar PostgreSQL para Conexiones Remotas (Resumido)

## Pasos en el VPS

```bash
# 1. Conectarse al VPS
ssh root@89.117.33.122

# 2. Ir al proyecto
cd /root/unikuo_plataform

# 3. Configurar PostgreSQL para aceptar conexiones remotas
docker compose exec database sh -c "echo 'host    all    all    0.0.0.0/0    md5' >> /var/lib/postgresql/data/pg_hba.conf"
docker compose exec database sh -c "echo \"listen_addresses = '*'\" >> /var/lib/postgresql/data/postgresql.conf"

# 4. Reiniciar BD
docker compose restart database

# 5. Esperar 10 segundos y verificar
sleep 10
docker compose ps
```

## Probar en Adminer

1. Abre: http://localhost:8080
2. Sistema: `PostgreSQL`
3. Servidor: `89.117.33.122:5433`
4. Usuario: `unikuo_user`
5. Contraseña: (la del VPS)
6. Base de datos: `unikuo_plataform`

¡Listo!
