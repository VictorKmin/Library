const router = require('express').Router();

const multer = require('multer');
const upload = multer({dest: '../public/'});

let topBooks = require('../controllers/book/getTopBooks');
let getBookById = require('../controllers/book/getBookById');
let readBook = require('../controllers/book/takeBookForReading');
let downloadBook = require('../controllers/book/downloadBook');
let addBook = require('../controllers/book/addBook');
let gelAllBooks = require('../controllers/book/gelAllBooks');
let stillReading = require('../controllers/book/stillReading');
let returnBook = require('../controllers/book/returnBook');
let uploadBook = require('../helper/fileUploader');

router.get('/top/:page/:limit', topBooks);
router.get('/:id', getBookById);
router.get('/download/:id', downloadBook);
router.post('/read/:id', readBook);
// Name in input on angular must be the same,like key in upload.single('key')
//  <input type="file" name="photo">  ---> upload.single('photo') ----> key is "photo"
router.post('/', upload.single('photo'), addBook);
router.get('/', gelAllBooks);
router.patch('/', stillReading);
router.delete('/return/:id', returnBook);

module.exports = router;


