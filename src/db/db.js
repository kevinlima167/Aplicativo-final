require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.postgres,
    host: process.env.localhost,
    database: process.env.AplicativoBackend,
    password: process.env.password,
    port: 5432,
});

module.exports = pool;
