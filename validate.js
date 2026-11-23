// Validation shared by the record routes. Same rules as the frontend (Activity 6).
const STATUSES = ["Pending", "In progress", "Completed"];
const MAX_ID = 2147483647; // largest value of a PostgreSQL integer id

// Returns a positive whole number, or null when the id is not valid.
function parseId(raw) {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

// Checks the four editable fields. Returns { message } on error, or { value }.
// Any id sent by the client is ignored.
function validateBody(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { message: "Request body must be a JSON object." };
  }

  const rules = [
    ["title", "Title", 3, 80],
    ["category", "Category", 2, 40],
    ["description", "Description", 5, 300]
  ];

  const value = {};
  for (const [field, label, min, max] of rules) {
    if (typeof body[field] !== "string") {
      return { message: label + " is required and must be text." };
    }
    value[field] = body[field].trim();
    if (value[field].length < min || value[field].length > max) {
      return { message: label + " must have " + min + " to " + max + " characters." };
    }
  }

  if (typeof body.status !== "string") {
    return { message: "Status is required and must be text." };
  }
  value.status = body.status.trim();
  if (!STATUSES.includes(value.status)) {
    return { message: "Status must be Pending, In progress or Completed." };
  }

  return { value };
}

module.exports = { STATUSES, MAX_ID, parseId, validateBody };
