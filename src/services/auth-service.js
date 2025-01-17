const Checker = require('../models/checker-model');
const Organisation = require('../models/org-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/mail-service');
const redisClient = require('../clients/redis-client');
const { secretKey } = require('../middlewares/auth');

class AuthService {
    async checkUser(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        let user = await Checker.findOne({ email });
        let userIdField = 'checkerId';
        let role = 'Checker';

        if (!user) {
            user = await Organisation.findOne({ email });
            userIdField = 'organisationId';
            role = 'Organisation';

            if (!user) {
                throw new Error('User not found.');
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials.');
        }

        const token = jwt.sign({ id: user[userIdField], role }, secretKey, { expiresIn: '1d' });

        return { token, role };
    }

    async sendResetCode(email) {
        if (!email) {
            throw new Error('Email is required.');
        }

        let user = await Checker.findOne({ email });
        let userType = "Checker";

        if (!user) {
            user = await Organisation.findOne({ email });
            userType = "Organisation";

            if (!user) {
                throw new Error('User not found.');
            }
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.setEx(`reset:${email}`, 600, JSON.stringify({ email, code }));

        await sendEmail(email, 'Reset Password Code', `Your reset password code is: ${code}`);

        return { message: 'Reset code sent to your email. Please verify your email.' };
    }

    async verifyResetCode(email, code) {
        if (!email || !code) {
            throw new Error('Email and confirmation code are required.');
        }

        const savedData = await redisClient.get(`reset:${email}`);
        if (!savedData) {
            throw new Error('The reset code has expired or does not exist.');
        }

        const { code: savedCode } = JSON.parse(savedData);

        if (savedCode !== code) {
            throw new Error('Invalid reset code.');
        }

        return { message: 'Reset code verified successfully.' };
    }

    async resetPassword(email, password) {
        if (!email || !password) {
            throw new Error("Email and password are required.");
        }
    
        let user = await Checker.findOne({ email });
        let userIdField = 'checkerId';
        let role = "Checker";
    
        if (!user) {
            user = await Organisation.findOne({ email });
            userIdField = 'organisationId';
            role = "Organisation";
    
            if (!user) {
                throw new Error("User not found.");
            }
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
    
        await user.save();

        const token = jwt.sign( { id: user[userIdField], role }, secretKey, { expiresIn: "1d" } );
    
        return { role, token };
    }
    
}

module.exports = new AuthService();
