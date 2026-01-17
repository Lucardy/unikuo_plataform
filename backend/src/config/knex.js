import knex from 'knex';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const dbHost = process.env.DB_HOST || 'database';
const dbPort = parseInt(process.env.DB_PORT) || 5432;

console.log(`🔗 Knex conectando a BD: ${dbHost}:${dbPort}`);

const db = knex({
    client: 'pg',
    connection: {
        host: dbHost,
        port: dbPort,
        database: process.env.DB_NAME || 'unikuo_plataform',
        user: process.env.DB_USER || 'unikuo_user',
        password: process.env.DB_PASSWORD || 'unikuo_password',
    },
    pool: {
        min: 2,
        max: 20
    },
});

export default db;
