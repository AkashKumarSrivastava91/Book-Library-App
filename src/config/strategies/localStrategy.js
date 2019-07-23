const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
    debug('In Local startegy function');
    passport.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (username, password, done) => {
        debug('In Local Strategy');
        const url = 'mongodb://localhost:27017';
        const dbName = 'Library-App';
        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');
                const db = client.db(dbName);
                const col = db.collection('user');
                const user = await col.findOne({ email: username });
                debug(user);
                if (!user) {
                    done(null, false, { message: 'User not found. Please signup.' });
                }

                if (user.password === password) {
                    debug('password matched');
                    done(null, user);
                } else {
                    done(null, false, { message: 'Invalid password. Please try again.' });
                }
            } catch (err) {
                debug(err.stack);
                done(err);
            }
            // Close connection
            client.close();
        }());
    }));
};
