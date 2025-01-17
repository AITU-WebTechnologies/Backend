const authService = require('../services/auth-service');

class AuthController {
    async checkUser(req, res) {
        try {
            const { email, password } = req.body;

            const { token, role } = await authService.checkUser(email, password);

            res.status(200).json({ token, role });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await authService.sendResetCode(email);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async verifyCode(req, res) {
        try {
            const { email, code } = req.body;
            await authService.verifyResetCode(email, code);
            res.status(200).json({ message: "Код успешно подтвержден." });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { email, password } = req.body;
    
            const { role, token } = await authService.resetPassword(email, password);
    
            res.status(200).json({ role, token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
}

module.exports = new AuthController();