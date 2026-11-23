const assert = require("assert");
const { parseId, validateBody } = require("../validate");

const good = { title: "  Abc ", category: "Ab", description: "12345", status: "Pending" };

assert.deepStrictEqual(validateBody(good).value, { title: "Abc", category: "Ab", description: "12345", status: "Pending" });
assert.ok(validateBody({ ...good, id: 99 }).value && !("id" in validateBody({ ...good, id: 99 }).value), "id ignored");
assert.ok(validateBody({ ...good, title: "   " }).message, "spaces only title");
assert.ok(validateBody({ ...good, title: "ab" }).message, "short title");
assert.ok(validateBody({ ...good, title: "x".repeat(81) }).message, "long title");
assert.ok(validateBody({ ...good, category: "a" }).message, "short category");
assert.ok(validateBody({ ...good, description: "1234" }).message, "short description");
assert.ok(validateBody({ ...good, description: "x".repeat(301) }).message, "long description");
assert.ok(validateBody({ ...good, status: "Done" }).message, "bad status");
assert.ok(validateBody({ ...good, status: "pending" }).message, "status is case sensitive");
assert.ok(validateBody({ ...good, title: 123 }).message, "non-string title");
assert.ok(validateBody({ title: "Abc" }).message, "missing fields");
assert.ok(validateBody(undefined).message, "no body");
assert.ok(validateBody([]).message, "array body");

assert.strictEqual(parseId("5"), 5);
assert.strictEqual(parseId("0"), null);
assert.strictEqual(parseId("-3"), null);
assert.strictEqual(parseId("1.5"), null);
assert.strictEqual(parseId("abc"), null);
assert.strictEqual(parseId(""), null);

console.log("All validation tests passed.");
