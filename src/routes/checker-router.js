const express = require('express');
const checkerController = require('../controllers/checker-controller');
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.post('/create-checker', checkerController.createCheckerTemp);

router.post('/confirm-checker', checkerController.confirmCheckerCode);

router.get('/profile', authenticateToken, checkerController.getProfile);

module.exports = router;