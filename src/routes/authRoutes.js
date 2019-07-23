const { MongoClient } = require('mongodb');
const express = require('express');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');


const authRouter = express.Router();

function router() {
    authRouter.route('/signup')
        .post((req, res) => {
            const { username, email, password } = req.body;
            const url = 'mongodb://127.0.0.1:27017';
            const dbName = 'Library-App';
            let client;

            (async function Mongo() {
                try {
                    client = await MongoClient.connect(url);
                    const db = client.db(dbName);
                    const col = db.collection('user');
                    const responseUser = await col.insertOne({ name: username, email, password });
                    debug(responseUser);
                    req.login(responseUser.ops[0], () => {
                        res.redirect('/books');
                    });
                } catch (err) {
                    debug(err.stack);
                }
                client.close();
            }());
        });

    authRouter.route('/signin')
        .get((req, res) => {
            res.render('signin');
        })
        .post((req, res, next) => {
            debug(req.body);
            // passport.authenticate('local', {
            //     successRedirect: '/books',
            //     failureRedirect: '/auth/signin'
            // });
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    debug(err);
                    res.redirect('/');
                }
                if (user) {
                    debug(user);
                    req.login(user, () => {
                        res.redirect('/books');
                    });
                }
            })(req, res, next);
        });

    authRouter.route('/logout')
        .get((req, res) => {
            req.logOut();
            res.redirect('/auth/signin');
        });

    return authRouter;
}

module.exports = router;
