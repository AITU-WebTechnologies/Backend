const authService = require('../services/auth-service');
const {verifyRefreshToken, generateTokens } = require('../middlewares/auth');

class AuthController {
    async checkUser(req, res) {
        try {
            const { email, password } = req.body;

            const { tokens, role } = await authService.checkUser(email, password);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, 
                secure: false,
              });
            const accessToken = tokens.accessToken
            res.status(200).json({ accessToken, role });
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

    async refreshTokens(req, res) {
        try {
            console.log('RefreshToken из cookies:', req.cookies.refreshToken);
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw new Error('Токен не найден');
    
            const decoded = await verifyRefreshToken(refreshToken);
            const tokens = generateTokens({ id: decoded.id });
    
            await authService.storeRefreshToken(decoded.id, tokens.refreshToken);
    
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: false,
            });
            res.status(200).json({ accessToken: tokens.accessToken });
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: error.message });
        }
    }
    
}

module.exports = new AuthController();