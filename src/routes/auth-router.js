const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth-controller');

router.post('/check-user', AuthController.checkUser);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-code', AuthController.verifyCode);
router.post('/reset-password', AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshTokens);

module.exports = router;
