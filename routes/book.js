const router = require('express').Router();

let topBooks = require('../controllers/book/getTopBooks');
let getBookInfo = require('../controllers/book/getBookInfo');

// /books?top=5
router.get('/top/:page/:limit', topBooks);
router.get('/:id', getBookInfo);

module.exports = router;


