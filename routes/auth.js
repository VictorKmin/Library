const router = require('express').Router();

let loginController = require('../controllers/auth/login');
let logoutController = require('../controllers/auth/logout');


router.post('/login', loginController);
router.delete('/logout', logoutController);

module.exports = router;