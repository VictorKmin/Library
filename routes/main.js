const router = require('express').Router();

let loginController = require('../controllers/login/login');
let logoutController = require('../controllers/login/logout');


router.post('/login', loginController);
router.delete('/login', logoutController);

module.exports = router;