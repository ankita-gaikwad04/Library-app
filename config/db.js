const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // 5433 for PG 18
});

// Test the connection when the app starts
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL 18 database'))
  .catch((err) => console.error('❌ Database connection error', err.stack));

module.exports = pool;