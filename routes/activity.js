const router = require('express').Router();

let getReadingActivityById = require('../controllers/activity/readingActivityById');
let getCommentActivityById = require('../controllers/activity/commentActivityById');
let getRatingActivityById = require('../controllers/activity/ratingActivityById');
let getMostReadedBooks = require('../controllers/activity/getMostReadedBooks');
let getTopUsers = require('../controllers/activity/getTopUsers');


router.get('/reading/:id', getReadingActivityById);
router.get('/comment/:id', getCommentActivityById);
router.get('/rating/:id', getRatingActivityById);
router.get('/topbooks/:limit', getMostReadedBooks);
router.get('/topusers/:limit', getTopUsers);
// comment info
module.exports = router;