const mysql = require('mysql2');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'live_electors',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : undefined
  });
}

module.exports = pool.promise();
