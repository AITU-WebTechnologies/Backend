const express = require('express');
const checkerController = require('../controller/checker-controller');

const router = express.Router();

router.post('/create-checker', checkerController.createChecker); 

module.exports = router;