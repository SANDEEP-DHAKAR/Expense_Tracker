const { signupUser, refreshAuth, logoutUser } = require('../services/authService');
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ✅ SIGNUP
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required',
            });
        }

        const user = await signupUser(name, email, password);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user,
        });

    } catch (error) {
        const message = error?.message || error?.sqlMessage || 'Signup failed';
        res.status(error.status || 400).json({
            success: false,
            message,
        });
    }
};

// ✅ LOGIN (FIXED)
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        const user = rows[0];

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // 🔥 FINAL TOKEN
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role   // 👈 MUST
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ✅ REFRESH
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const data = await refreshAuth(refreshToken);

        res.status(200).json({
            success: true,
            ...data,
        });

    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ LOGOUT
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const data = await logoutUser(refreshToken);

        res.status(200).json({
            success: true,
            ...data,
        });

    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ FINAL EXPORT (IMPORTANT FIX)
module.exports = { signup, login, refresh, logout };