const express = require('express');
const passport = require('./src/db/passport');
const authRoutes = require('./src/routes/auth');
const articleRoutes = require('./src/routes/articles');
require("dotenv").config()


const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use('/api', authRoutes);
app.use('/api', articleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
