const router = require('express').Router();

let topBooks = require('../controllers/book/getTopBooks');
let getBookInfo = require('../controllers/book/getBookInfo');
let readBook = require('../controllers/book/takeBookForReading');

// /books?top=5
router.get('/top/:page/:limit', topBooks);
router.get('/:id', getBookInfo);
router.post('/read/:id', readBook);

module.exports = router;


