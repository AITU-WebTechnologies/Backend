const jwt = require('jsonwebtoken');
const secretKey = 'nc938=]16sFaFGSAb5v293n8257235=-35-90gism9etnb903';

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

