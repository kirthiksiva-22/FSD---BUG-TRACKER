const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
const SECRET = 'change_this_secret';

function auth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  try { req.user = jwt.verify(token, SECRET); next(); }
  catch { res.status(401).json({ error: 'Not logged in' }); }
}

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hash = bcrypt.hashSync(password, 10);
    const r = db.prepare(
      'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)'
    ).run(name, email, hash, role === 'developer' ? 'developer' : 'reporter');
    res.json({ id: r.lastInsertRowid });
  } catch { res.status(400).json({ error: 'Email already used' }); }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  if (!u || !bcrypt.compareSync(password, u.password))
    return res.status(401).json({ error: 'Wrong email or password' });
  const token = jwt.sign({ id: u.id, name: u.name, role: u.role }, SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: u.id, name: u.name, role: u.role } });
});

app.get('/api/users', auth, (req, res) => {
  res.json(db.prepare("SELECT id,name FROM users WHERE role='developer'").all());
});

app.post('/api/bugs', auth, (req, res) => {
  const { title, description, priority } = req.body;
  const r = db.prepare(
    'INSERT INTO bugs (title,description,priority,reported_by) VALUES (?,?,?,?)'
  ).run(title, description, priority || 'Medium', req.user.id);
  res.json({ id: r.lastInsertRowid });
});

app.get('/api/bugs', auth, (req, res) => {
  const { status, priority } = req.query;
  let sql = 'SELECT * FROM bugs WHERE 1=1';
  const p = [];
  if (status)   { sql += ' AND status=?';   p.push(status); }
  if (priority) { sql += ' AND priority=?'; p.push(priority); }
  res.json(db.prepare(sql + ' ORDER BY id DESC').all(...p));
});

app.get('/api/bugs/:id', auth, (req, res) => {
  const bug = db.prepare('SELECT * FROM bugs WHERE id=?').get(req.params.id);
  if (!bug) return res.status(404).json({ error: 'Not found' });
  const history = db.prepare(
    `SELECT h.*, u.name AS changed_by_name FROM history h
     JOIN users u ON u.id = h.changed_by
     WHERE h.bug_id=? ORDER BY h.id DESC`
  ).all(req.params.id);
  res.json({ bug, history });
});

app.put('/api/bugs/:id', auth, (req, res) => {
  const bug = db.prepare('SELECT * FROM bugs WHERE id=?').get(req.params.id);
  if (!bug) return res.status(404).json({ error: 'Not found' });
  const log = db.prepare(
    'INSERT INTO history (bug_id,changed_by,field,old_value,new_value) VALUES (?,?,?,?,?)'
  );
  for (const f of ['status', 'priority', 'assigned_to']) {
    if (req.body[f] !== undefined && String(req.body[f]) !== String(bug[f])) {
      db.prepare(`UPDATE bugs SET ${f}=? WHERE id=?`).run(req.body[f], bug.id);
      log.run(bug.id, req.user.id, f, bug[f], req.body[f]);
    }
  }
  res.json({ ok: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));