const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const db = new sqlite3.Database('./database.db');

app.use(bodyParser.json());
app.use(express.static('.'));

db.run(`CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS notas(id INTEGER PRIMARY KEY, texto TEXT, likes INTEGER DEFAULT 0)`);

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO usuarios(username, password) VALUES(?, ?)`, [username, password]);
  res.send('Usuario registrado');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM usuarios WHERE username=? AND password=?`, [username, password], (err, row) => {
    if (row) res.sendStatus(200);
    else res.sendStatus(401);
  });
});

app.post('/nota', (req, res) => {
  const { texto } = req.body;
  db.run(`INSERT INTO notas(texto) VALUES(?)`, [texto]);
  res.sendStatus(200);
});

app.get('/notas', (req, res) => {
  db.all(`SELECT * FROM notas`, [], (err, rows) => res.json(rows));
});

app.post('/nota/:id/like', (req, res) => {
  db.run(`UPDATE notas SET likes = likes + 1 WHERE id=?`, [req.params.id]);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
