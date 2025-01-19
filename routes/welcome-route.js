const express = require('express');
const router = express.Router();
const welcomeController = require('../controllers/welcome-controller');

router.get('/login', welcomeController.halogin);
router.get('/login_admin', welcomeController.loginadmin);

module.exports = router;