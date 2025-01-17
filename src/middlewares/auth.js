const jwt = require('jsonwebtoken');
const secretKey = process.env.secretKey;

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = { authenticateToken, secretKey };

