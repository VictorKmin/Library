const router = require('express').Router();

// let allBookComments = require('../controllers/comment/getAllBookComments');
let createNewComment = require('../controllers/comment/createNewComment');
let deleteComment = require('../controllers/comment/deleteById');
// let updateComment = require('../controllers/comment/updateById');

// router.get('/', allBookComments);
router.post('/', createNewComment);
router.delete('/:id', deleteComment);
// router.patch('/:id', updateComment);

module.exports = router;