const Organisation = require('../entity/org-entity')
const OrganisationDTO = require('../dto/org-dto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt'); 
const { secretKey } = require('../middlewares/auth');

class OrganisationController {
    async createOrganisation(req, res) {
        try {
            const { title, role, email, password } = req.body;

            if (!title || !role || !email || !password) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const organisation = new Organisation({
                title,
                role,
                email,
                password: hashedPassword
            });

            const savedOrganisation = await organisation.save();
            const organisationDTO = new OrganisationDTO(savedOrganisation);

            const token = jwt.sign({ id: savedOrganisation.organisationId }, secretKey, { expiresIn: '1d' }); 
                        
            res.status(201).json({ organisation: organisationDTO, token });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = new OrganisationController(); 