const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const { matches, count } = require("../lib/store");

const NOTES_FILE = path.join(__dirname, "..", "notes.json");

const notes = [
  { id: 1, text: "buy milk" },
  { id: 2, text: "call the bank" },
  { id: 3, text: "milk the almonds" },
];

test("search finds every note that contains the term", () => {
  const result = matches(notes, "milk");
  assert.strictEqual(result.length, 2);
});

test("search finds a single containing note", () => {
  const result = matches(notes, "bank");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].id, 2);
});

test("search returns nothing when no note contains the term", () => {
  const result = matches(notes, "xyz");
  assert.strictEqual(result.length, 0);
});

test("search is case-insensitive", () => {
  const result = matches(notes, "MILK");
  assert.strictEqual(result.length, 2);
});

test("count returns the number of stored notes", () => {
  const existed = fs.existsSync(NOTES_FILE);
  const backup = existed ? fs.readFileSync(NOTES_FILE, "utf8") : null;

  try {
    fs.writeFileSync(NOTES_FILE, JSON.stringify({ nextId: 4, notes }));
    assert.strictEqual(count(), 3);
  } finally {
    if (existed) {
      fs.writeFileSync(NOTES_FILE, backup);
    } else {
      fs.rmSync(NOTES_FILE, { force: true });
    }
  }
});
