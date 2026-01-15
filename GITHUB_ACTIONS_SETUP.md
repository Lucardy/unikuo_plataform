# 🚀 Configurar GitHub Actions para Despliegue Automático

Esta guía te explica cómo configurar el despliegue automático desde GitHub al VPS.

## 📋 Requisitos Previos

- ✅ Repositorio en GitHub
- ✅ VPS con Docker instalado
- ✅ Acceso SSH al VPS configurado
- ✅ Proyecto ya desplegado en el VPS (al menos una vez)

---

## 🔑 Paso 1: Generar Clave SSH para GitHub Actions

### 1.1. Generar nueva clave SSH (en tu computadora o VPS)

```bash
# En tu computadora o VPS
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

**Importante:**
- Cuando te pida passphrase, presiona Enter (sin contraseña)
- Esto creará dos archivos:
  - `~/.ssh/github_actions_deploy` (clave privada)
  - `~/.ssh/github_actions_deploy.pub` (clave pública)

### 1.2. Agregar clave pública al VPS

```bash
# Copiar la clave pública al VPS
cat ~/.ssh/github_actions_deploy.pub

# En el VPS, agregar a authorized_keys
ssh root@89.117.33.122
mkdir -p ~/.ssh
echo "TU_CLAVE_PUBLICA_AQUI" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 1.3. Obtener la clave privada

```bash
# En tu computadora, mostrar la clave privada
cat ~/.ssh/github_actions_deploy

# Copia TODO el contenido (desde -----BEGIN hasta -----END)
```

---

## 🔐 Paso 2: Configurar Secrets en GitHub

### 2.1. Ir a tu repositorio en GitHub

1. Ve a: `https://github.com/TU_USUARIO/unikuo_plataform`
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**

### 2.2. Agregar los siguientes secrets:

#### Secret 1: `VPS_HOST`
- **Name**: `VPS_HOST`
- **Value**: `89.117.33.122` (tu IP del VPS)

#### Secret 2: `VPS_USER`
- **Name**: `VPS_USER`
- **Value**: `root` (o tu usuario SSH)

#### Secret 3: `SSH_PRIVATE_KEY`
- **Name**: `SSH_PRIVATE_KEY`
- **Value**: Pega la clave privada completa (la que copiaste antes)
  - Debe incluir `-----BEGIN OPENSSH PRIVATE KEY-----` y `-----END OPENSSH PRIVATE KEY-----`

#### Secret 4 (Opcional): `VPS_PORT`
- **Name**: `VPS_PORT`
- **Value**: `22` (puerto SSH por defecto, solo si usas otro puerto)

---

## ✅ Paso 3: Verificar que el Workflow Existe

El archivo `.github/workflows/deploy.yml` ya está creado en tu proyecto.

**Estructura:**
```
unikuo_plataform/
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 🧪 Paso 4: Probar el Despliegue

### 4.1. Hacer un cambio pequeño

```bash
# Hacer un cambio en cualquier archivo
# Por ejemplo, actualizar README.md
```

### 4.2. Commit y Push

```bash
git add .
git commit -m "Test: despliegue automático"
git push origin main
```

### 4.3. Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Deberías ver el workflow "Deploy Unikuo Platform to VPS" ejecutándose
4. Click en el workflow para ver los logs en tiempo real

### 4.4. Verificar en el VPS

```bash
# Conectarse al VPS
ssh root@89.117.33.122

# Ver logs de docker-compose
cd /root/unikuo_plataform
docker-compose logs -f
```

---

## 🔍 Solución de Problemas

### Error: "Permission denied (publickey)"

**Causa**: La clave SSH no está configurada correctamente.

**Solución**:
1. Verifica que la clave pública esté en `~/.ssh/authorized_keys` del VPS
2. Verifica los permisos:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```
3. Verifica que la clave privada en GitHub Secrets esté completa (con BEGIN y END)

### Error: "git pull failed"

**Causa**: Problemas con Git en el VPS.

**Solución**:
```bash
# En el VPS
cd /root/unikuo_plataform
git config --global --add safe.directory /root/unikuo_plataform
```

### Error: "docker-compose: command not found"

**Causa**: Docker Compose no está instalado o usa `docker compose` (sin guión).

**Solución**: El workflow ya maneja esto automáticamente, pero si persiste:
```bash
# En el VPS, instalar docker-compose
sudo apt install docker-compose -y
```

### El despliegue no se ejecuta

**Verificar**:
1. ¿El branch es `main`? (el workflow solo se ejecuta en `main`)
2. ¿Los secrets están configurados correctamente?
3. ¿El archivo `.github/workflows/deploy.yml` está en el repositorio?

---

## 🔄 Flujo Completo

```
1. Haces cambios en tu código local
   ↓
2. git add . && git commit -m "..." && git push origin main
   ↓
3. GitHub detecta el push a main
   ↓
4. GitHub Actions ejecuta el workflow
   ↓
5. Se conecta al VPS por SSH
   ↓
6. Hace git pull
   ↓
7. Reconstruye imágenes Docker
   ↓
8. Reinicia servicios con docker-compose
   ↓
9. ✅ Tu aplicación está actualizada en el VPS
```

---

## 📝 Notas Importantes

1. **`.env` NO se sube a Git**: Asegúrate de que el archivo `.env` esté creado en el VPS antes del primer despliegue automático.

2. **Primera vez**: El primer despliegue puede tardar más porque reconstruye todo.

3. **Logs**: Siempre puedes ver los logs del despliegue en la pestaña "Actions" de GitHub.

4. **Rollback**: Si algo sale mal, puedes hacer rollback manualmente en el VPS:
   ```bash
   cd /root/unikuo_plataform
   git log  # Ver commits
   git reset --hard COMMIT_ANTERIOR
   docker-compose build && docker-compose up -d
   ```

---

## 🎯 Checklist

Antes de probar:

- [ ] Clave SSH generada
- [ ] Clave pública agregada al VPS (`~/.ssh/authorized_keys`)
- [ ] Clave privada agregada a GitHub Secrets (`SSH_PRIVATE_KEY`)
- [ ] `VPS_HOST` configurado en GitHub Secrets
- [ ] `VPS_USER` configurado en GitHub Secrets
- [ ] Archivo `.github/workflows/deploy.yml` existe
- [ ] `.env` existe en el VPS
- [ ] Docker y docker-compose funcionan en el VPS

---

## ✅ ¡Listo!

Una vez configurado, cada vez que hagas `git push origin main`, tu aplicación se actualizará automáticamente en el VPS. 🎉
