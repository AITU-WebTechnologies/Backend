const Checker = require('../entity/checker-entity');
const Organisation = require('../entity/org-entity');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretKey } = require('../middlewares/auth');

class AuthController {
    async checkUser(req, res) {
        try {
            const { email, password } = req.body;


            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            let user = await Checker.findOne({ email });
            let userIdField = 'checkerId';

            if (!user) {
                user = await Organisation.findOne({ email });
                userIdField = 'organisationId';

                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
            }

            console.log('User found:', user);

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Invalid credentials');
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            const token = jwt.sign({ id: user[userIdField] }, secretKey, { expiresIn: '1d' });

            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = new AuthController();
