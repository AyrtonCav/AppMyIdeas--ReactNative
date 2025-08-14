// src/routes/ideaRoutes.js
const express = require('express');
const router = express.Router();
const {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea
} = require('../controllers/ideaController');

// Definindo as rotas
router.post('/ideias', createIdea);
router.get('/ideias', getAllIdeas);
router.get('/ideias/:id', getIdeaById);
router.put('/ideias/:id', updateIdea);
router.delete('/ideias/:id', deleteIdea);

module.exports = router;
