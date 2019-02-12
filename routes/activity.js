const router = require('express').Router();

let getReadingActivityById = require('../controllers/activity/readingActivityById');
let getAllReadingActivity = require('../controllers/activity/fullReadingActivity');
let getCommentActivityById = require('../controllers/activity/commentActivityById');
let getAllCommentActivity = require('../controllers/activity/fullCommentActivity');
let getRatingActivityById = require('../controllers/activity/ratingActivityById');
let getAllRatingActivity = require('../controllers/activity/fullRatingActivity');
let getMostReadedBooks = require('../controllers/activity/getMostReadedBooks');
let getTopUsers = require('../controllers/activity/getTopUsers');


router.get('/reading/:id', getReadingActivityById);
router.get('/reading', getAllReadingActivity);
router.get('/comment/:id', getCommentActivityById);
router.get('/comment', getAllCommentActivity);
router.get('/rating/:id', getRatingActivityById);
router.get('/rating', getAllRatingActivity);
router.get('/topbooks/:limit', getMostReadedBooks);
router.get('/topusers/:limit', getTopUsers);
// comment info
module.exports = router;