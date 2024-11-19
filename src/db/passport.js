const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const pool = require('./db.js'); // pool de conexão do banco de dados
const JWT_SECRET = process.env.JWT_SECRET;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [payload.id]);
      if (rows.length > 0) {
        return done(null, rows[0]);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
