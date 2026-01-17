# Script para renombrar columnas en lotes
# Ejecuta la migración 009 por partes

$password = "unikuo_password_seguro"
$host = "89.117.33.122"
$port = "5433"
$user = "unikuo_user"
$db = "unikuo_plataform"

function Execute-SQL {
    param([string]$sql)
    
    $sql | docker run --rm -i -e PGPASSWORD=$password postgres:16-alpine psql -h $host -p $port -U $user -d $db 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR ejecutando SQL:" -ForegroundColor Red
        Write-Host $sql
        return $false
    }
    return $true
}

Write-Host "Renombrando columnas de la base de datos a español..." -ForegroundColor Cyan
Write-Host ""

# PASO 1: usuarios
Write-Host "1. Renombrando columnas de 'usuarios'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE usuarios RENAME COLUMN first_name TO nombre;
ALTER TABLE usuarios RENAME COLUMN last_name TO apellido;
ALTER TABLE usuarios RENAME COLUMN password TO contrasena;
ALTER TABLE usuarios RENAME COLUMN active TO activo;
ALTER TABLE usuarios RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE usuarios RENAME COLUMN created_at TO creado_en;
ALTER TABLE usuarios RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 2: roles
Write-Host "2. Renombrando columnas de 'roles'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE roles RENAME COLUMN name TO nombre;
ALTER TABLE roles RENAME COLUMN description TO descripcion;
ALTER TABLE roles RENAME COLUMN created_at TO creado_en;
ALTER TABLE roles RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 3: usuario_roles
Write-Host "3. Renombrando columnas de 'usuario_roles'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE usuario_roles RENAME COLUMN user_id TO usuario_id;
ALTER TABLE usuario_roles RENAME COLUMN role_id TO rol_id;
ALTER TABLE usuario_roles RENAME COLUMN created_at TO creado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 4: clientes
Write-Host "4. Renombrando columnas de 'clientes'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE clientes RENAME COLUMN name TO nombre;
ALTER TABLE clientes RENAME COLUMN phone TO telefono;
ALTER TABLE clientes RENAME COLUMN domain TO dominio;
ALTER TABLE clientes RENAME COLUMN active TO activo;
ALTER TABLE clientes RENAME COLUMN owner_id TO propietario_id;
ALTER TABLE clientes RENAME COLUMN created_at TO creado_en;
ALTER TABLE clientes RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 5: registros_auditoria
Write-Host "5. Renombrando columnas de 'registros_auditoria'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE registros_auditoria RENAME COLUMN user_id TO usuario_id;
ALTER TABLE registros_auditoria RENAME COLUMN action TO accion;
ALTER TABLE registros_auditoria RENAME COLUMN table_name TO nombre_tabla;
ALTER TABLE registros_auditoria RENAME COLUMN record_id TO registro_id;
ALTER TABLE registros_auditoria RENAME COLUMN old_values TO valores_antiguos;
ALTER TABLE registros_auditoria RENAME COLUMN new_values TO valores_nuevos;
ALTER TABLE registros_auditoria RENAME COLUMN ip_address TO direccion_ip;
ALTER TABLE registros_auditoria RENAME COLUMN created_at TO creado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 6: categorias
Write-Host "6. Renombrando columnas de 'categorias'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE categorias RENAME COLUMN name TO nombre;
ALTER TABLE categorias RENAME COLUMN description TO descripcion;
ALTER TABLE categorias RENAME COLUMN image_url TO url_imagen;
ALTER TABLE categorias RENAME COLUMN active TO activo;
ALTER TABLE categorias RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE categorias RENAME COLUMN created_at TO creado_en;
ALTER TABLE categorias RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 7: marcas
Write-Host "7. Renombrando columnas de 'marcas'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE marcas RENAME COLUMN name TO nombre;
ALTER TABLE marcas RENAME COLUMN description TO descripcion;
ALTER TABLE marcas RENAME COLUMN logo_url TO url_logo;
ALTER TABLE marcas RENAME COLUMN active TO activo;
ALTER TABLE marcas RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE marcas RENAME COLUMN created_at TO creado_en;
ALTER TABLE marcas RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 8: colores
Write-Host "8. Renombrando columnas de 'colores'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE colores RENAME COLUMN name TO nombre;
ALTER TABLE colores RENAME COLUMN hex_code TO codigo_hex;
ALTER TABLE colores RENAME COLUMN active TO activo;
ALTER TABLE colores RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE colores RENAME COLUMN created_at TO creado_en;
ALTER TABLE colores RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 9: tipos_talle
Write-Host "9. Renombrando columnas de 'tipos_talle'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE tipos_talle RENAME COLUMN name TO nombre;
ALTER TABLE tipos_talle RENAME COLUMN description TO descripcion;
ALTER TABLE tipos_talle RENAME COLUMN active TO activo;
ALTER TABLE tipos_talle RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE tipos_talle RENAME COLUMN created_at TO creado_en;
ALTER TABLE tipos_talle RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 10: talles
Write-Host "10. Renombrando columnas de 'talles'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE talles RENAME COLUMN name TO nombre;
ALTER TABLE talles RENAME COLUMN size_type_id TO tipo_talle_id;
ALTER TABLE talles RENAME COLUMN order_index TO orden;
ALTER TABLE talles RENAME COLUMN active TO activo;
ALTER TABLE talles RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE talles RENAME COLUMN created_at TO creado_en;
ALTER TABLE talles RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 11: generos
Write-Host "11. Renombrando columnas de 'generos'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE generos RENAME COLUMN name TO nombre;
ALTER TABLE generos RENAME COLUMN description TO descripcion;
ALTER TABLE generos RENAME COLUMN active TO activo;
ALTER TABLE generos RENAME COLUMN created_at TO creado_en;
ALTER TABLE generos RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 12: tipos_medida
Write-Host "12. Renombrando columnas de 'tipos_medida'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE tipos_medida RENAME COLUMN name TO nombre;
ALTER TABLE tipos_medida RENAME COLUMN unit TO unidad;
ALTER TABLE tipos_medida RENAME COLUMN description TO descripcion;
ALTER TABLE tipos_medida RENAME COLUMN active TO activo;
ALTER TABLE tipos_medida RENAME COLUMN created_at TO creado_en;
ALTER TABLE tipos_medida RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

# PASO 13: productos
Write-Host "13. Renombrando columnas de 'productos'..." -ForegroundColor Yellow
$sql = @"
ALTER TABLE productos RENAME COLUMN name TO nombre;
ALTER TABLE productos RENAME COLUMN description TO descripcion;
ALTER TABLE productos RENAME COLUMN category_id TO categoria_id;
ALTER TABLE productos RENAME COLUMN gender_id TO genero_id;
ALTER TABLE productos RENAME COLUMN measure_type_id TO tipo_medida_id;
ALTER TABLE productos RENAME COLUMN base_price TO precio_base;
ALTER TABLE productos RENAME COLUMN cost_price TO precio_costo;
ALTER TABLE productos RENAME COLUMN active TO activo;
ALTER TABLE productos RENAME COLUMN featured TO destacado;
ALTER TABLE productos RENAME COLUMN tenant_id TO cliente_id;
ALTER TABLE productos RENAME COLUMN created_at TO creado_en;
ALTER TABLE productos RENAME COLUMN updated_at TO actualizado_en;
"@
if (!(Execute-SQL $sql)) { exit 1 }

Write-Host ""
Write-Host "✅ Parte 1 completada (tablas principales y catálogos)" -ForegroundColor Green
Write-Host "Continuando con productos y relaciones..." -ForegroundColor Cyan
Write-Host ""

# Continúa en la siguiente parte...
