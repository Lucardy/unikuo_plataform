import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: 'postgres://unikuo_user:unikuo_password_seguro@89.117.33.122:5433/unikuo_plataform'
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to remote DB');

        // Update the domain (using 'dominio' column name which is the Spanish one)
        const res = await client.query(
            "UPDATE clientes SET dominio = $1 WHERE slug = $2 RETURNING *",
            ['89.117.33.122', 'unikuo-demo']
        );

        console.log('Update result:', res.rows[0]);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.end();
    }
}

run();
