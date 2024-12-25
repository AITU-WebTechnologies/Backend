const express = require('express');
const organisationController = require('../controller/org-controller'); 

const router = express.Router();

router.post('/create-org', organisationController.createOrganisation); 

module.exports = router;