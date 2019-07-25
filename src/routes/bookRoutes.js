const express = require('express');
const debug = require('debug')('app:bookRoutes');
const bookController = require('../controllers/bookController');

const bookRouter = express.Router();

function router(nav) {
  const { getBooks, getBookById } = bookController(nav);
  bookRouter.use((req, res, next) => {
    debug(req.user);
    if (req.user) {
      next();
    } else {
      res.redirect('/auth/signin');
    }
  });

  bookRouter.route('/')
    .get(getBooks);

  bookRouter.route('/:id')
    .get(getBookById);
  return bookRouter;
}

module.exports = router;
