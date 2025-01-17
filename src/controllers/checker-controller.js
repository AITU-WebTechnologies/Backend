const { ConnectionClosedEvent } = require('mongodb');
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
            const result = await checkerService.confirmCheckerCode(data);
            res.status(200).json(result);
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
}

module.exports = new CheckerController();