// src/controllers/authController.js
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'troquinha_de_segurança_local'; // troque em produção

// Register
const register = (req, res) => {
  const { nome, email, password, nascimento, telefone, instagram_username } = req.body;

  if (!email || !password || !nome) {
    return res.status(400).json({ error: 'nome, email e password são obrigatórios' });
  }

  // verificar se email já existe
  const checkQuery = 'SELECT id FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    if (results.length > 0) return res.status(409).json({ error: 'Email já cadastrado' });

    // hash da senha
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const insertQuery = `INSERT INTO users (nome, email, password_hash, nascimento, telefone, instagram_username, created_at)
                         VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    db.query(insertQuery, [nome, email, password_hash, nascimento || null, telefone || null, instagram_username || null], (err2, result) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }
      return res.status(201).json({ message: 'Usuário criado', id: result.insertId });
    });
  });
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

  const query = 'SELECT id, nome, email, password_hash, nascimento, telefone, instagram_username FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    // gerar token simples (JWT)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // não enviar password_hash no retorno
    delete user.password_hash;

    return res.status(200).json({ token, user });
  });
};

// exemplo de rota protegida (opcional)
const me = (req, res) => {
  // req.user preenchido pelo middleware
  const userId = req.user.id;
  const query = 'SELECT id, nome, email, nascimento, telefone, instagram_username, created_at FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json(results[0]);
  });
};

module.exports = {
  register,
  login,
  me
};
