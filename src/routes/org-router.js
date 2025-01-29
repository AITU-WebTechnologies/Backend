const express = require('express');
const organisationController = require('../controllers/org-controller'); 
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.post('/create-org', organisationController.createOrgTemp); 

router.post('/confirm-org', organisationController.confirmOrganisationCode);

router.get('/profile', authenticateToken, organisationController.getProfile);

router.put('/update-profile', authenticateToken, organisationController.updateProfile);

router.delete('/delete-account', authenticateToken, organisationController.deleteProfile);

module.exports = router;