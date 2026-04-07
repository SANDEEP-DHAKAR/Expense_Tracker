const { signupUser, loginUser } = require('../services/authService');

// Signup Controller
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
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Login Controller
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
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { signup, login };