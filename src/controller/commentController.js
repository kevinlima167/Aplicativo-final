const pool = require('../db/db')

const commentController = {
  async create(req, res) {
    const { content, articleId } = req.body
    const authorId = req.userId

    try {
      const result = await pool.query(
        'INSERT INTO comments (content, author_id, article_id) VALUES ($1, $2, $3) RETURNING *',
        [content, authorId, articleId]
      )

      res.status(201).json(result.rows[0])
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar comentário' })
    }
  },

  async getByArticle(req, res) {
    const { articleId } = req.params

    try {
      const result = await pool.query(`
        SELECT c.*, u.username as author_name 
        FROM comments c 
        JOIN users u ON c.author_id = u.id 
        WHERE c.article_id = $1 
        ORDER BY c.created_at DESC
      `, [articleId])

      res.json(result.rows)
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar comentários' })
    }
  },

  async delete(req, res) {
    const { id } = req.params
    const authorId = req.userId

    try {
      const comment = await pool.query('SELECT * FROM comments WHERE id = $1', [id])
      
      if (comment.rows.length === 0) {
        return res.status(404).json({ error: 'Comentário não encontrado' })
      }

      if (comment.rows[0].author_id !== authorId) {
        return res.status(403).json({ error: 'Não autorizado' })
      }

      await pool.query('DELETE FROM comments WHERE id = $1', [id])
      res.json({ message: 'Comentário deletado com sucesso' })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar comentário' })
    }
  }
}

module.exports = commentController