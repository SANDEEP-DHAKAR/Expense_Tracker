const express = require('express');
const router = express.Router();

const { signup, login, refresh, logout, forgotPasswordController, resetPasswordController, googleAuthController } = require('../controllers/authController');
const { authLimiter } = require("../middleware/rateLimiters");
const {
    validateSignup,
    validateLogin,
    validateRefreshOrLogout,
    validateGoogleAuth,
} = require("../middleware/validateRequest");

router.post('/signup', authLimiter, validateSignup, signup);
router.post('/login', authLimiter, validateLogin, login);
router.post('/google', authLimiter, validateGoogleAuth, googleAuthController);
router.post('/refresh', authLimiter, validateRefreshOrLogout, refresh);
router.post('/logout', authLimiter, validateRefreshOrLogout, logout);
router.post('/forgot-password', authLimiter, forgotPasswordController);
router.post('/reset-password', authLimiter, resetPasswordController);

module.exports = router;
