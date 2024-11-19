const pool = require('../db/db.js');

async function validateArticleContent(req, res, next) {
  const { title, content } = req.body;
  if (!title || title.length < 5) {
    return res.status(400).json({ message: 'O título deve ter pelo menos 5 caracteres.' });
  }
  if (!content || content.length < 20) {
    return res.status(400).json({ message: 'O conteúdo deve ter pelo menos 20 caracteres.' });
  }
  next();
}

async function isAuthor(req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    const article = rows[0];

    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }

    if (article.author_id !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para modificar este artigo.' });
    }

    req.article = article;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar autor do artigo.' });
  }
}

module.exports = { validateArticleContent, isAuthor };
