require("dotenv").config();
const { Pool } = require("pg");

// DATABASE_URL looks like: postgresql://user:password@host:5432/dbname
// Hosted databases usually need SSL: set DATABASE_SSL=true in the host settings.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false
});

pool.on("error", error => {
  console.error("Unexpected database error:", error.message);
});

module.exports = pool;
