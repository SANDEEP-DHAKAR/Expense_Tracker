const { signupUser, loginUser, refreshAuth, logoutUser } = require('../services/authService');

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
        res.status(error.status || 400).json({
            success: false,
            message: error.message || 'Signup failed',
        });
    }
};

// ✅ LOGIN (🔥 FINAL FIX)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 🔥 SERVICE CALL (NO manual DB / NO manual bcrypt)
        const data = await loginUser(email, password);

        res.json({
            success: true,
            message: "Login successful",
            ...data
        });

    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Login failed"
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

// ✅ EXPORT
module.exports = { signup, login, refresh, logout };