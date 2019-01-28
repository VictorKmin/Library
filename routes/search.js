const router = require('express').Router();
let searchByTag = require('../controllers/search/searchByTag');
let fullSearch = require('../controllers/search/fullSearch');

router.get('/tag/:tag', searchByTag);
router.get('/', fullSearch);

module.exports = router;