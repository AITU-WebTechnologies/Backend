const express = require('express');
const router = express.Router();

const AuthController = require('../controller/auth-controller');

router.post('/check-user', AuthController.checkUser);

module.exports = router;
