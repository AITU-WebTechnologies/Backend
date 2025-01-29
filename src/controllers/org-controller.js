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
            const { accessToken, refreshToken } = await organisationService.confirmOrganisationCode(data);
            
              res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, 
                secure: false,
              });
            res.status(200).json({ accessToken });
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

    async updateProfile(req, res) {
        try {
          const organisationId = req.user.id;
          const { title } = req.body;
          if (!title) {
            return res.status(400).json({ message: 'Название компании обязательно.' });
          }
    
          const updatedProfile = await organisationService.updateProfile(organisationId, { title });
          res.status(200).json(updatedProfile);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
    
      async deleteProfile(req, res) {
        try {
          const organisationId = req.user.id;
          await organisationService.deleteProfile(organisationId);
          res.status(200).json({ message: 'Аккаунт успешно удалён.' });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
}

module.exports = new OrganisationController();