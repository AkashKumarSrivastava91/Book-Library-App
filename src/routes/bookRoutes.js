const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.use((req, res, next) => {   
    debug(req.user);
    if (req.user) {
      next();
    } else {
      res.redirect('/auth/signin');
    }
  });

  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://127.0.0.1:27017';
      const dbName = 'Library-App';

      (async function mongo() {
        let client;
        try {
          debug(url);
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');
          const db = client.db(dbName);
          const col = await db.collection('books');
          const books = await col.find().toArray();
          debug(books);
          res.render(
            'booksListView',
            {
              nav,
              title: 'Library',
              books
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://127.0.0.1:27017';
      const dbName = 'Library-App';

      (async function mongo() {
        let client;
        try {
          debug(url);
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');
          const db = client.db(dbName);
          const col = await db.collection('books');
          const book = await col.findOne({ _id: ObjectID(id) });
          debug(book);

          res.render(
            'bookView',
            {
              nav,
              title: 'Library',
              book
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  return bookRouter;
}

module.exports = router;
