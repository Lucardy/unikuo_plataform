# 🔍 Verificar Docker en el VPS

## Comandos para Verificar Docker

Ejecuta estos comandos en el VPS para ver qué tienes instalado:

```bash
# Verificar Docker
docker --version

# Verificar Docker Compose (versión nueva - v2)
docker compose version

# Verificar Docker Compose (versión antigua - v1)
docker-compose --version

# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Ver imágenes Docker
docker images
```

## Soluciones Según lo que Tengas

### Si tienes `docker compose` (v2 - con espacio):

El workflow de GitHub Actions ya maneja esto, pero para usar manualmente:

```bash
# En vez de: docker-compose ps
# Usa: docker compose ps

docker compose ps
docker compose logs
docker compose up -d
```

### Si NO tienes docker-compose instalado:

```bash
# Instalar docker-compose
sudo apt update
sudo apt install docker-compose -y
```

### Si tienes Docker pero no Compose:

```bash
# Instalar Docker Compose v2 (recomendado)
sudo apt update
sudo apt install docker-compose-plugin -y
```
