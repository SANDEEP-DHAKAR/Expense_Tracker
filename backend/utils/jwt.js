const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

const generateRefreshToken = () => {
    return crypto.randomUUID();
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken
};