const organisationService = require('../services/org-service');

class OrganisationController {
    async createOrgTemp(req, res) {
        try {
            const data = req.body;
            const result = await organisationService.createOrganisationTemp(data);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async confirmOrganisationCode(req, res) {
        try {
            const data = req.body;
            const result = await organisationService.confirmOrganisationCode(data);
            res.status(200).json(result);;
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
    async getProfile(req, res) {
        try {
            const organisationId = req.user.id;
            const profile = await organisationService.getProfile(organisationId);
            res.status(200).json(profile);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new OrganisationController();