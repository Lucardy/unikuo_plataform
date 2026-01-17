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

        const email = 'luckardyy@gmail.com';
        const newPassword = 'admin123'; // CLAVE TEMPORAL

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update
        const res = await client.query(
            "UPDATE usuarios SET contrasena = $1 WHERE email = $2 RETURNING id, email",
            [hashedPassword, email]
        );

        if (res.rowCount === 0) {
            console.log(`❌ Usuario ${email} no encontrado.`);
        } else {
            console.log(`✅ Contraseña actualizada para ${email}. Nueva clave: ${newPassword}`);
        }

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await client.end();
    }
}

run();
