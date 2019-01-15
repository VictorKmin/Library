const router = require('express').Router();

let loginController = require('../controllers/login');
let logoutController = require('../controllers/logout');


router.get('/login', loginController);
router.delete('/login', logoutController);

module.exports = router;