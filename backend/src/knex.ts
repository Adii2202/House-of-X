import knex from 'knex';
import getEnv from "./config"

const env = getEnv();

const db = knex({
    client: 'mysql2',
    connection: {
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
    },
});

export default db;