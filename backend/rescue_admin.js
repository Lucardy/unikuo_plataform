import pg from 'pg';
import bcrypt from 'bcrypt';
const { Client } = pg;

const client = new Client({
    connectionString: 'postgres://unikuo_user:unikuo_password_seguro@89.117.33.122:5433/unikuo_plataform'
});

async function run() {
    try {
        await client.connect();
        console.log('🔗 Conectado a DB remota');

        // ==========================================
        // 1. Rescatar ADMIN (Super Admin)
        // ==========================================
        const adminEmail = 'admin@unikuo.com';
        const adminPass = 'admin123';

        const salt = await bcrypt.genSalt(10);
        const hashedAdminPass = await bcrypt.hash(adminPass, salt);

        const resAdmin = await client.query(
            "UPDATE usuarios SET contrasena = $1 WHERE email = $2 RETURNING id",
            [hashedAdminPass, adminEmail]
        );

        let adminId;
        if (resAdmin.rowCount === 0) {
            console.log(`❌ Usuario ADMIN ${adminEmail} no encontrado.`);
        } else {
            adminId = resAdmin.rows[0].id;
            console.log(`✅ ADMIN: Clave actualizada a '${adminPass}'`);

            // Asignar rol super_admin
            const resRolSuper = await client.query("SELECT id FROM roles WHERE nombre = 'super_admin'");
            if (resRolSuper.rows.length > 0) {
                const superRolId = resRolSuper.rows[0].id;
                await client.query(`
                INSERT INTO usuario_roles (usuario_id, rol_id) 
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
            `, [adminId, superRolId]);
                console.log('✅ ADMIN: Rol super_admin asignado.');
            }
        }

        // ==========================================
        // 2. Crear Nuevo Cliente de Prueba
        // ==========================================
        const clientEmail = 'cliente@prueba.com';
        const clientPass = 'cliente123';
        const tiendaNombre = 'Tienda de Prueba';
        const tiendaSlug = 'tienda-prueba';
        const tiendaDominio = 'prueba.unikuo.com'; // Dominio ficticio

        // A. Crear/Actualizar Usuario Cliente
        const hashedClientPass = await bcrypt.hash(clientPass, salt);

        // Intentamos buscar si existe
        let resClientUser = await client.query("SELECT id FROM usuarios WHERE email = $1", [clientEmail]);
        let clientId;

        if (resClientUser.rows.length > 0) {
            clientId = resClientUser.rows[0].id;
            await client.query("UPDATE usuarios SET contrasena = $1 WHERE id = $2", [hashedClientPass, clientId]);
            console.log(`✅ CLIENTE: Usuario '${clientEmail}' actualizado. Clave: '${clientPass}'`);
        } else {
            // Crear usuario
            resClientUser = await client.query(`
            INSERT INTO usuarios (email, contrasena, nombre, apellido, activo, email_verificado)
            VALUES ($1, $2, 'Cliente', 'Prueba', true, true)
            RETURNING id
        `, [clientEmail, hashedClientPass]);
            clientId = resClientUser.rows[0].id;
            console.log(`✅ CLIENTE: Usuario '${clientEmail}' creado. Clave: '${clientPass}'`);
        }

        // B. Asignar rol store_owner
        const resRolStore = await client.query("SELECT id FROM roles WHERE nombre = 'store_owner'");
        if (resRolStore.rows.length > 0) {
            const storeRolId = resRolStore.rows[0].id;
            await client.query(`
            INSERT INTO usuario_roles (usuario_id, rol_id) 
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [clientId, storeRolId]);
        }

        // C. Crear Tenant (Tienda)
        // Usamos las columnas en español corregidas: telefono, dominio, creado_en, actualizado_en
        const resTenant = await client.query(`
        INSERT INTO clientes (
            nombre, slug, email, dominio, propietario_id, activo, 
            theme_config, layout_config, componentes_config
        ) VALUES (
            $1, $2, $3, $4, $5, true,
            '{}', '{}', '{"modulos": {"productos": true, "categorias": true, "stock": true}}'
        )
        ON CONFLICT (slug) DO UPDATE SET 
            nombre = EXCLUDED.nombre,
            dominio = EXCLUDED.dominio,
            propietario_id = EXCLUDED.propietario_id
        RETURNING id;
    `, [tiendaNombre, tiendaSlug, clientEmail, tiendaDominio, clientId]);

        console.log(`✅ CLIENTE: Tenant '${tiendaNombre}' creado/actualizado.`);


    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await client.end();
    }
}

run();
