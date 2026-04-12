const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // ❌ No header
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing',
            });
        }

        // ✅ Check format: Bearer TOKEN
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format',
            });
        }

        const token = authHeader.split(' ')[1];

        // ❌ Token missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token missing',
            });
        }

        // 🔐 Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔥 Attach user
        req.user = decoded;

        next();

    } catch (error) {

        // 🔥 Specific error handling
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = authMiddleware;