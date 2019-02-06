const router = require('express').Router();

let getUserInfo = require('../controllers/user/getInfo');


router.get('/info', getUserInfo);

module.exports = router;