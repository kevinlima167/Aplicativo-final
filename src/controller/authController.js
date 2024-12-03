const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    // Registro de usuário
    async register(req, res) {
        try {
            const { user_name, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const newUser = await pool.query(
                'INSERT INTO usuario (user_name, password) VALUES ($1, $2) RETURNING *',
                [user_name, hashedPassword]
            );
            
            res.status(201).json({ message: 'Usuário criado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Login
    async login(req, res) {
        try {
            const { user_name, password } = req.body;
            
            const user = await pool.query('SELECT * FROM usuario WHERE user_name = $1', [user_name]);
            
            if (user.rows.length === 0) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            
            if (!validPassword) {
                return res.status(401).json({ error: 'Senha inválida' });
            }

            const token = jwt.sign(
                { id: user.rows[0].usuario_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;