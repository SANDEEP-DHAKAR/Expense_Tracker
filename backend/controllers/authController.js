const {
    signupUser,
    loginUser,
    refreshAuth,
    logoutUser,
    googleAuthService
} = require("../services/authService");
const {
    forgotPassword,
    resetPassword
} = require("../services/passwordResetService");

// ✅ SIGNUP
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        const data = await signupUser(name, email, password);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            ...data,
        });

    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Signup failed",
        });
    }
};

// ✅ LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const data = await loginUser(email, password);

        res.json({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        });

    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Login failed",
        });
    }
};

// ✅ REFRESH
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const data = await refreshAuth(refreshToken);

        res.json({
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

        res.json({
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

// ✅ FORGOT PASSWORD
const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const frontendOrigin = req.get("origin");
        const data = await forgotPassword(email, frontendOrigin);

        res.json({
            success: true,
            ...data
        });

    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Forgot password failed",
        });
    }
};

// ✅ RESET PASSWORD
const resetPasswordController = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        const data = await resetPassword(token, password);

        res.json({
            success: true,
            ...data
        });

    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Reset password failed",
        });
    }
};

// ✅ GOOGLE AUTH
const googleAuthController = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: "Google idToken is required",
            });
        }

        const data = await googleAuthService(idToken);

        res.json({
            success: true,
            message: "Google authentication successful",
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });

    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Google authentication failed",
        });
    }
};

module.exports = {
    signup,
    login,
    refresh,
    logout,
    forgotPasswordController,
    resetPasswordController,
    googleAuthController,
};
