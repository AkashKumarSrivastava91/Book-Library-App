const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');


function bookController(nav) {
    function getBooks(req, res) {
        {
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
        }
    }
    function getBookById(req, res) {
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
    }

    return {
        getBooks,
        getBookById
    };
}

module.exports = bookController;
