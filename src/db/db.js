require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.admin,
    host: process.env.localhost,
    database: process.env.meu_banco,
    password: process.env.admin123,
    port: 5432,
});

module.exports = pool;
