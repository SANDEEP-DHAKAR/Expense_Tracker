const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        // ❌ Token expired (no spam logs)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired",
            });
        }

        // ❌ Invalid token
        if (error.name === "JsonWebTokenError") {
            console.log("Auth Error:", error.message);

            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        // ❌ Unknown error
        console.log("Auth Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = authMiddleware;