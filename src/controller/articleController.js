const pool = require('../db/db')

const articleController = {
  async create(req, res) {
    const { title, content } = req.body
    const authorId = req.userId // Vem do middleware de autenticação

    try {
      const result = await pool.query(
        'INSERT INTO articles (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
        [title, content, authorId]
      )

      res.status(201).json(result.rows[0])
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar artigo' })
    }
  },

  async getAll(req, res) {
    try {
      const result = await pool.query(`
        SELECT a.*, u.username as author_name 
        FROM articles a 
        JOIN users u ON a.author_id = u.id 
        ORDER BY a.created_at DESC
      `)
      res.json(result.rows)
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar artigos' })
    }
  },

  async getOne(req, res) {
    const { id } = req.params

    try {
      const result = await pool.query(`
        SELECT a.*, u.username as author_name 
        FROM articles a 
        JOIN users u ON a.author_id = u.id 
        WHERE a.id = $1
      `, [id])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Artigo não encontrado' })
      }

      res.json(result.rows[0])
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar artigo' })
    }
  },

  async update(req, res) {
    const { id } = req.params
    const { title, content } = req.body
    const authorId = req.userId

    try {
      const article = await pool.query('SELECT * FROM articles WHERE id = $1', [id])
      
      if (article.rows.length === 0) {
        return res.status(404).json({ error: 'Artigo não encontrado' })
      }

      if (article.rows[0].author_id !== authorId) {
        return res.status(403).json({ error: 'Não autorizado' })
      }

      const result = await pool.query(
        'UPDATE articles SET title = $1, content = $2 WHERE id = $3 RETURNING *',
        [title, content, id]
      )

      res.json(result.rows[0])
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar artigo' })
    }
  },

  async delete(req, res) {
    const { id } = req.params
    const authorId = req.userId

    try {
      const article = await pool.query('SELECT * FROM articles WHERE id = $1', [id])
      
      if (article.rows.length === 0) {
        return res.status(404).json({ error: 'Artigo não encontrado' })
      }

      if (article.rows[0].author_id !== authorId) {
        return res.status(403).json({ error: 'Não autorizado' })
      }

      await pool.query('DELETE FROM articles WHERE id = $1', [id])
      res.json({ message: 'Artigo deletado com sucesso' })
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar artigo' })
    }
  }
}

module.exports = articleController