const Database = require('better-sqlite3');
const db = new Database('bugtracker.db');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, email TEXT UNIQUE, password TEXT,
  role TEXT DEFAULT 'reporter'
);
CREATE TABLE IF NOT EXISTS bugs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT, description TEXT,
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Open',
  reported_by INTEGER, assigned_to INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bug_id INTEGER, changed_by INTEGER,
  field TEXT, old_value TEXT, new_value TEXT,
  changed_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

module.exports = db;