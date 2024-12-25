const Organisation = require('../entity/org-entity')
const OrganisationDTO = require('../dto/org-dto')

class OrganisationController {
    async createOrganisation(req, res) {
        try {
            const { title, role, email, password } = req.body;

            if (!title || !role || !email || !password) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const organisation = new Organisation({
                title,
                role,
                email,
                password
            });

            const savedOrganisation = await organisation.save();
            const organisationDTO = new OrganisationDTO(savedOrganisation);

            res.status(201).json(organisationDTO);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = new OrganisationController(); 