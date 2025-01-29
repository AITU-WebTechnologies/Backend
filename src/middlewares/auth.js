const jwt = require('jsonwebtoken');
const redisClient = require('../clients/redis-client');
const secretKey = process.env.secretKey;
const refreshSecretKey = process.env.refreshSecretKey;

const authenticateToken = (req, res, next) => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Доступ запрещен');

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).send('Токен недействителен');
    }
};

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: '30d' });
    return { accessToken, refreshToken };
};

const verifyRefreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, refreshSecretKey);
        const storedToken = await redisClient.get(`refreshToken:${decoded.id}`);
        if (storedToken !== refreshToken) throw new Error('Токен не найден');
        return decoded;
    } catch (err) {
        throw new Error('Недействительный refresh-токен');
    }
};

module.exports = {
    authenticateToken,
    generateTokens,
    verifyRefreshToken,
};
