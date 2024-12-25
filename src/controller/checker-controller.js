const Checker = require('../entity/checker-entity')
const CheckerDTO = require('../dto/checker-dto')

class CheckerController {
    async createChecker(req, res) {
        try {
            const { name, surname, role, email, password } = req.body;

            if (!name || !surname || !role || !email || !password) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const checker = new Checker({
                name,
                surname,
                role,
                email,
                password
            });

            const savedChecker = await checker.save();
            const checkerDTO = new CheckerDTO(savedChecker);

            res.status(201).json(checkerDTO);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = new CheckerController(); 