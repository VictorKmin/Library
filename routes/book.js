const router = require('express').Router();

let topBooks = require('../controllers/book/getTopBooks');
let getBookInfo = require('../controllers/book/getBookInfo');
let readBook = require('../controllers/book/takeBookForReading');
let downloadBook = require('../controllers/book/downloadBook');
let addBook = require('../controllers/book/addBook');

// /books?top=5
router.get('/top/:page/:limit', topBooks);
router.get('/:id', getBookInfo);
router.get('/download/:id', downloadBook);
router.post('/read/:id', readBook);
router.post('/', addBook);

module.exports = router;


