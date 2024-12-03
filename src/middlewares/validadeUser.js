const passport = require('passport');
require('../db/passport');

const validateInput = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username e senha são obrigatórios.' });
    }
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ message: 'Username deve ter entre 3 e 30 caracteres.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres.' });
    }
    next();
};

module.exports=validateInput