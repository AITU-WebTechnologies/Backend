const checkerService = require('../services/checker-service');


class CheckerController {

    async createCheckerTemp(req, res) {
        try {
            const data = req.body;
            const result = await checkerService.createCheckerTemp(data);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async confirmCheckerCode(req, res) {
        try {
            const data = req.body;
            const { accessToken, refreshToken } = await checkerService.confirmCheckerCode(data);
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
            const checkerId = req.user.id;
            const profile = await checkerService.getProfile(checkerId);
            res.status(200).json(profile);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const checkerId = req.user.id;
            const { firstName, lastName } = req.body;
            if (!firstName || !lastName) {
                return res.status(400).json({ message: 'Имя и фамилия обязательны.' });
            }

            const updatedChecker = await checkerService.updateProfile(checkerId, { firstName, lastName });
            res.status(200).json(updatedChecker);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteProfile(req, res) {
        try {
            const checkerId = req.user.id;
            await checkerService.deleteProfile(checkerId);
            res.status(200).json({ message: 'Аккаунт успешно удалён.' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new CheckerController();