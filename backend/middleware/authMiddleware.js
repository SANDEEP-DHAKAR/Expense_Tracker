const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // 🔹 Token get from header
        const authHeader = req.headers.authorization;

        console.log("HEADER:", authHeader); // 👈 DEBUG

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }

        // Format: Bearer TOKEN
        const token = authHeader.split(' ')[1];

        console.log("TOKEN:", token); // 👈 DEBUG
        console.log("SECRET:", process.env.JWT_SECRET); // 👈 DEBUG

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token missing',
            });
        }

        // 🔹 Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED:", decoded); // 👈 DEBUG

        // 🔹 Attach user to request
        req.user = decoded;

        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message); // 👈 DEBUG

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

module.exports = authMiddleware;