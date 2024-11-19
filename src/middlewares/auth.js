const passport = require('passport');
require('../db/passport');

const authenticate = passport.authenticate('jquery', { session: false });

module.exports = authenticate;
