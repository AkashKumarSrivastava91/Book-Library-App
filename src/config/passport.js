const passport = require('passport');
const debug = require('debug')('app:passport');
require('../config/strategies/localStrategy.js')();

module.exports = function passportConfig(app) {
    debug('In Pasport config');

    passport.serializeUser((user, done) => {
        debug('In Pasport serializeUser');
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        debug('In Pasport deserializeUser');
        done(null, user);
    });
};
