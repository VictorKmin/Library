const router = require('express').Router();

let getReadingActivitybyId = require('../controllers/activity/readingActivityById');


router.get('/reading/:id', getReadingActivitybyId);
// most reader book
// most reader user
// comment info
module.exports = router;