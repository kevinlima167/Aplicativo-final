const express = require('express');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use('/api', authRoutes);
app.use('/api', articleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
