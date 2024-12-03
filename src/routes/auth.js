const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db.js');
const validateInput = require('../middlewares/validadeUser.js'); // Importa o middleware
const router = express.Router();

// Registro de usuário
router.post('/register', validateInput, async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar se o username já existe
        const userExists = await pool.query('SELECT usuario_ID FROM usuario WHERE user_name = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Username já está em uso.' });
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        // Inserir no banco de dados
        const result = await pool.query(
            'INSERT INTO usuario (user_name, password) VALUES ($1, $2) RETURNING usuario_ID, user_name',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'Usuário registrado com sucesso!', user: result.rows[0] });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Login de usuário
router.post('/login', validateInput, async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar usuário no banco de dados
        const result = await pool.query('SELECT * FROM usuario WHERE user_name = $1', [username]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            // Gerar token JWT com tempo de expiração
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ message: 'Login bem-sucedido!', token });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});


module.exports = router;
