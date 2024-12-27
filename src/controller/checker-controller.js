const Checker = require('../entity/checker-entity')
const CheckerDTO = require('../dto/checker-dto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt'); 
const { secretKey } = require('../middlewares/auth');

class CheckerController {
    async createChecker(req, res) {
        try {
            const { name, surname, role, email, password } = req.body;

            if (!name || !surname || !role || !email || !password) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const checker = new Checker({
                name,
                surname,
                role,
                email,
                password: hashedPassword
            });

            const savedChecker = await checker.save();
            const checkerDTO = new CheckerDTO(savedChecker);

            const token = jwt.sign({ id: savedChecker.checkerId }, secretKey, { expiresIn: '1d' }); 
            
            res.status(201).json({ checker: checkerDTO, token });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = new CheckerController(); 