// src/controllers/ideaController.js
const db = require('../models/db');

// Função para criar uma nova ideia
const createIdea = (req, res) => {
  const { titulo, videoUrl, musicaUrl, categoria, descricao, status, favorito, publicidade, data } = req.body;

  const formattedDate = new Date(data).toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'

  console.log("Data formatada:", formattedDate);

  console.log("Dados recebidos para criação da ideia:", req.body);

  const query = 'INSERT INTO ideias (titulo, videoUrl, musicaUrl, categoria, descricao, status, favorito, publicidade, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [titulo, videoUrl, musicaUrl, categoria, descricao, status, favorito, publicidade, formattedDate], (err, result) => {
    if (err) {
      console.error("Erro ao tentar salvar a ideia:", err);
      res.status(500).json({ error: 'Erro ao criar a ideia' });
      return;
    }
    res.status(201).json({ message: 'Ideia criada com sucesso!', id: result.insertId });
  });
};

// Função para obter todas as ideias
const getAllIdeas = (req, res) => {
  const query = 'SELECT * FROM ideias';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar as ideias' });
      return;
    }
    res.status(200).json(results);
  });
};

// Função para obter uma ideia específica pelo ID
const getIdeaById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM ideias WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar a ideia' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Ideia não encontrada' });
      return;
    }
    res.status(200).json(results[0]);
  });
};

// Função para atualizar uma ideia
const updateIdea = (req, res) => {
  const { id } = req.params;

  const { titulo, videoUrl, musicaUrl, categoria, descricao, status, favorito, publicidade, data } = req.body;

  const formattedDate = new Date(data).toISOString().slice(0, 19).replace('T', ' '); 

  const query = `
    UPDATE ideias 
    SET titulo = ?, videoUrl = ?, musicaUrl = ?, categoria = ?, descricao = ?, status = ?, favorito = ?, publicidade = ?, data = ?
    WHERE id = ?`;

  db.query(query, [titulo, videoUrl, musicaUrl, categoria, descricao, status, favorito, publicidade, formattedDate, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao atualizar a ideia' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Ideia não encontrada' });
      return;
    }
    res.status(200).json({ message: 'Ideia atualizada com sucesso!' });
  });
};

// Função para excluir uma ideia
const deleteIdea = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM ideias WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao excluir a ideia' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Ideia não encontrada' });
      return;
    }
    res.status(200).json({ message: 'Ideia excluída com sucesso!' });
  });
};

module.exports = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea
};
