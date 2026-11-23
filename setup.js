// Creates the records table and inserts the starting records (once).
// Run with: npm run setup
const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function main() {
  for (const file of ["schema.sql", "seed.sql"]) {
    const sql = fs.readFileSync(path.join(__dirname, file), "utf8");
    await pool.query(sql);
    console.log("Ran " + file);
  }
  const result = await pool.query("SELECT COUNT(*)::int AS total FROM records");
  console.log("Records in database: " + result.rows[0].total);
}

main()
  .catch(error => {
    console.error("Setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
