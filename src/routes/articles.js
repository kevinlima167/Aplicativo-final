const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middlewares/auth');
const { validateArticleContent, isAuthor } = require('../middlewares/validateArticle');
const router = express.Router();

// Rota para listar todos os artigos
router.get('/articles', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM articles');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar artigos.' });
  }
});

// Rota para criar um novo artigo 
router.post('/articles/create', authenticate, validateArticleContent, async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id;

  try {
    await pool.query(
      'INSERT INTO articles (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, authorId]
    );
    res.status(201).json({ message: 'Artigo criado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar artigo.' });
  }
});

// Rota para editar um artigo 
router.put('/articles/:id/edit', authenticate, isAuthor, validateArticleContent, async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      'UPDATE articles SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    res.json({ message: 'Artigo atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar artigo.' });
  }
});

// Rota para excluir um artigo 
router.delete('/articles/:id/delete', authenticate, isAuthor, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    res.json({ message: 'Artigo excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir artigo.' });
  }
});

module.exports = router;
