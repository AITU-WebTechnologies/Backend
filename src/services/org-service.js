const Organisation = require('../models/org-model');
const Checker = require("../models/checker-model")
const OrganisationDTO = require('../dto/org-dto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mail-service');
const redisClient = require('../clients/redis-client');
const { secretKey } = require('../middlewares/auth');

class OrganisationService {

    async createOrganisationTemp(data) {
        const { title, role, email, password } = data;

        if (!title || !role || !email || !password) {
            throw new Error('All fields are required.');
        }

        const existingOrganisation = await Organisation.findOne({ email });
        const existingChecker = await Checker.findOne({ email });

        if (existingOrganisation || existingChecker) {
            throw new Error('Email is already in use.');
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const orgData = { title, role, email, password };
        await redisClient.setEx(`orgData:${email}`, 600, JSON.stringify(orgData));
        await redisClient.setEx(`confirmation:${email}`, 600, code);

        await sendEmail(email, 'Confirmation Code', `Your confirmation code is: ${code}`);

        return { message: 'Confirmation code sent to your email. Please verify your email.' };
    }

    async confirmOrganisationCode(data) {
        const { email, code } = data;

        if (!email || !code) {
            throw new Error('Email and confirmation code are required.');
        }

        const savedCode = await redisClient.get(`confirmation:${email}`);
        if (savedCode !== code) {
            throw new Error('Invalid confirmation code.');
        }

        const orgDataString = await redisClient.get(`orgData:${email}`);
        if (!orgDataString) {
            throw new Error('Organisation data not found.');
        }

        const orgData = JSON.parse(orgDataString);
        const { title, role, password } = orgData;

        const hashedPassword = await bcrypt.hash(password, 10);
        const organisation = new Organisation({
            title,
            role,
            email,
            password: hashedPassword,
        });

        const savedOrganisation = await organisation.save();
        const organisationDTO = new OrganisationDTO(savedOrganisation);

        const token = jwt.sign({ id: savedOrganisation.organisationId }, secretKey, { expiresIn: '1d' });

        await redisClient.del(`confirmation:${email}`);
        await redisClient.del(`orgData:${email}`);

        return { organisation: organisationDTO, token };
    }

    async getProfile(organisationId) {
        const organisation = await Organisation.findOne({ organisationId});
        if (!organisation) {
            throw new Error('Пользователь не найден.');
        }
        return { title: organisation.title };
    }
}

module.exports = new OrganisationService();