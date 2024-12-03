const jwt = require('jsonwebtoken');
const pool = require('../db/db');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query('SELECT * FROM usuario WHERE usuario_ID = $1', [decoded.id]);

        if (user.rows.length === 0) {
            throw new Error();
        }

        req.user = user.rows[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Por favor, autentique-se.' });
    }
};

module.exports = authMiddleware;