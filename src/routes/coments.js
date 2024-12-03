const express = require('express');
const router = express.Router();
const { Comment } = require('../db/db');
const { ensureAuthenticated } = require('../middlewares/auth');

// Adicionar um comentário
router.post('/:id/comments', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const newComment = await Comment.create({ content, usuario_Id: req.usuario.id,artigo_ID : ID });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listagem de comentários de um artigo
router.get('/:id/comments', async (req, res) => {
    const { id } = req.params;
    const comments = await Comment.findAll({ where: { artigo_ID: id } });
    res.json(comments);
});

module.exports = router;
