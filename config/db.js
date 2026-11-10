const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // THIS IS THE FIX: Force SSL for cloud databases (like Supabase)
  ssl: process.env.DB_HOST === 'localhost' ? false : { rejectUnauthorized: false }
});

// Test the connection when the app starts
pool.connect()
  .then(() => console.log('✅ Connected to Database successfully!'))
  .catch((err) => console.error('❌ Database connection error:', err.message));

module.exports = pool;