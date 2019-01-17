const router = require('express').Router();

let top5ByRating = require('../controllers/book/getTop5ByRating');
let infoAboutBook = require('../controllers/book/getInfoAboutBook');


router.get('/gettop5', top5ByRating);
router.get('/:id', infoAboutBook);

module.exports = router;