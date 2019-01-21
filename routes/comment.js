const router = require('express').Router();

let allBookComments = require('../controllers/comment/getAllBookComments');
let createNewComment = require('../controllers/comment/createNewComment');

router.get('/', allBookComments);
router.post('/', createNewComment);

module.exports = router;