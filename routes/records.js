const router = require("express").Router();
const pool = require("../db");
const { MAX_ID, parseId, validateBody } = require("../validate");

const COLUMNS = "id, title, category, description, status";

// Sends a JSON error with a message field.
function fail(res, status, message) {
  return res.status(status).json({ message });
}

// Returns a valid id, or sends the right error and returns null.
function readId(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    fail(res, 400, "Id must be a positive whole number.");
    return null;
  }
  return id;
}

// GET /api/records  - all records
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT " + COLUMNS + " FROM records ORDER BY id"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/records/:id  - one record
router.get("/:id", async (req, res, next) => {
  try {
    const id = readId(req, res);
    if (id === null) return;
    if (id > MAX_ID) return fail(res, 404, "Record not found.");

    const result = await pool.query(
      "SELECT " + COLUMNS + " FROM records WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) return fail(res, 404, "Record not found.");
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/records  - create a record (any client-supplied id is ignored)
router.post("/", async (req, res, next) => {
  try {
    const check = validateBody(req.body);
    if (check.message) return fail(res, 400, check.message);
    const v = check.value;

    const result = await pool.query(
      "INSERT INTO records (title, category, description, status) " +
        "VALUES ($1, $2, $3, $4) RETURNING " + COLUMNS,
      [v.title, v.category, v.description, v.status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/records/:id  - replace the four editable fields
router.put("/:id", async (req, res, next) => {
  try {
    const id = readId(req, res);
    if (id === null) return;

    const check = validateBody(req.body);
    if (check.message) return fail(res, 400, check.message);
    if (id > MAX_ID) return fail(res, 404, "Record not found.");
    const v = check.value;

    const result = await pool.query(
      "UPDATE records SET title = $1, category = $2, description = $3, status = $4 " +
        "WHERE id = $5 RETURNING " + COLUMNS,
      [v.title, v.category, v.description, v.status, id]
    );
    if (result.rowCount === 0) return fail(res, 404, "Record not found.");
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/records/:id  - delete a record
router.delete("/:id", async (req, res, next) => {
  try {
    const id = readId(req, res);
    if (id === null) return;
    if (id > MAX_ID) return fail(res, 404, "Record not found.");

    const result = await pool.query(
      "DELETE FROM records WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0) return fail(res, 404, "Record not found.");
    res.status(200).json({ message: "Record deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
