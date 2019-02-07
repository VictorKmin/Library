const router = require('express').Router();
const IMAGES = require('../constants/files').IMAGES;
const AUDIO = require('../constants/files').AUDIO;
const TEXT = require('../constants/files').TEXT;
const VIDEO = require('../constants/files').VIDEO;
// multer is library for uploading files
const multer = require('multer');

// multer setting.
const storage = multer.diskStorage({
    // it folder where we store file
    destination: function (req, file, cb) {
        if (IMAGES.includes(file.mimetype)) {
            cb(null, 'public/images')
        } else if (AUDIO.includes(file.mimetype) || TEXT.includes(file.mimetype) || VIDEO.includes(file.mimetype)) {
            cb(null, 'public/files')
        } else {
            cb('UNKNOWN FILE', null);
        }
    },
    //
    filename: function (req, file, cb) {
        console.log(file);
        // Build name like 1549350785625.jpg
        cb(null, new Date().getTime() + '.' + file.originalname.split('.').pop())
    }
});
const upload = multer({storage});

const topBooks = require('../controllers/book/getTopBooks');
const getBookById = require('../controllers/book/getBookById');
const readBook = require('../controllers/book/takeBookForReading');
const downloadBook = require('../controllers/book/downloadBook');
const addBook = require('../controllers/book/addBook');
const gelAllBooks = require('../controllers/book/gelAllBooks');
const stillReading = require('../controllers/book/stillReading');
const returnBook = require('../controllers/book/returnBook');
//ADMIN CONTROLLERS
const deleteBook = require('../controllers/book/deleteBook');
const updateBook = require('../controllers/book/updateBook');

router.get('/top/:page/:limit', topBooks);
router.get('/:id', getBookById);
router.get('/download/:id', downloadBook);
router.post('/read/:id', readBook);
// Name in input on angular must be the same,like key in upload.single('key')
//  <input type="file" name="photo">  ---> upload.single('photo') ----> key is "photo"
router.post('/', upload.fields([{name: 'photo', maxCount: 1}, {name: 'file', maxCount: 1}]), addBook);
router.get('/', gelAllBooks);
router.patch('/', stillReading);
router.delete('/return/:id', returnBook);
//ADMIN ROUTES
router.delete('/:id', deleteBook);
router.put('/:id', upload.fields([{name: 'photo', maxCount: 1}, {name: 'file', maxCount: 1}]), updateBook);

module.exports = router;


