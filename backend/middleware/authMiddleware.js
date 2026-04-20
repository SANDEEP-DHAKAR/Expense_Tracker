const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // ❌ No Authorization header
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            });
        }

        // ❌ Invalid format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format",
            });
        }

        // ✅ Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        // 🔐 Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔥 Attach user (IMPORTANT: should contain id, email, role)
        req.user = decoded;

        next();

    } catch (error) {
        console.log("Auth Error:", error.message);

        // ❌ Token expired
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired",
            });
        }

        // ❌ Invalid token
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        // ❌ Unknown error
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = authMiddleware;