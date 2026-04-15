const { signupUser, loginUser, refreshAuth, logoutUser } = require('../services/authService');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await signupUser(name, email, password);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user,
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            ...data,
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message,
        });
    }
};

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

module.exports = { signup, login, refresh, logout };