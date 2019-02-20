const router = require('express').Router();

let getAllSubjects= require('../controllers/subject/getAllSubjects');

router.get('/', getAllSubjects);

module.exports = router;