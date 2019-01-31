const router = require('express').Router();

let topBooks = require('../controllers/book/getTopBooks');
let getBookById = require('../controllers/book/getBookById');
let readBook = require('../controllers/book/takeBookForReading');
let downloadBook = require('../controllers/book/downloadBook');
let addBook = require('../controllers/book/addBook');
let gelAllBooks = require('../controllers/book/gelAllBooks');
let stillReading = require('../controllers/book/stillReading');
let returnBook = require('../controllers/book/returnBook');

router.get('/top/:page/:limit', topBooks);
router.get('/:id', getBookById);
router.get('/download/:id', downloadBook);
router.post('/read/:id', readBook);
router.post('/', addBook);
router.get('/', gelAllBooks);
router.patch('/', stillReading);
router.delete('/return/:id', returnBook);

module.exports = router;


