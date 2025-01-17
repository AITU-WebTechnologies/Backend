const Checker = require('../models/checker-model');
const Organisation = require("../models/org-model")
const CheckerDTO = require('../dto/checker-dto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mail-service');
const redisClient = require('../clients/redis-client');
const { secretKey } = require('../middlewares/auth');

class CheckerService {

    async createCheckerTemp(data) {
        const { name, surname, role, email, password } = data;

        if (!name || !surname || !role || !email || !password) {
            throw new Error('All fields are required.');
        }

        const existingChecker = await Checker.findOne({ email });
        const existingOrganisation = await Organisation.findOne({ email });

        if (existingChecker || existingOrganisation) {
            throw new Error('Email is already in use.');
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const userData = { name, surname, role, email, password };
        await redisClient.setEx(`userData:${email}`, 600, JSON.stringify(userData));

        await redisClient.setEx(`confirmation:${email}`, 600, code);

        await sendEmail(email, 'Confirmation Code', `Your confirmation code is: ${code}`);

        return { message: 'Confirmation code sent to your email. Please verify your email.' };
    }

    async confirmCheckerCode(data) {
        const { email, code } = data;
    
        if (!email || !code) {
            throw new Error('Email and confirmation code are required.');
        }
    
        const savedCode = await redisClient.get(`confirmation:${email}`);
        if (savedCode !== code) {
            throw new Error('Invalid confirmation code.');
        }
    
        const userDataString = await redisClient.get(`userData:${email}`);
        if (!userDataString) {
            throw new Error('User data not found.');
        }
    
        const userData = JSON.parse(userDataString);
        const { name, surname, role, password } = userData;
    
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
    
        await redisClient.del(`confirmation:${email}`);
        await redisClient.del(`userData:${email}`);
    
        return { checker: checkerDTO, token };
    }

    async getProfile(checkerId) {
        const checker = await Checker.findOne({ checkerId});
        if (!checker) {
            throw new Error('Пользователь не найден.');
        }
        return { firstName: checker.name, lastName: checker.surname };
    }
    
}

module.exports = new CheckerService();