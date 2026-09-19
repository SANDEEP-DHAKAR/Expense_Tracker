const crypto = require('crypto');
const { createUser, findUserByEmail, findUserById } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { saveRefreshToken, findRefreshToken, revokeRefreshToken } = require('../models/tokenModel');
const { createDefaultCategories } = require('./categoryService');
const { verifyGoogleIdToken } = require('../utils/googleAuth');

// ✅ SIGNUP (AUTO LOGIN)
const signupUser = async (name, email, password) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        const error = new Error('User already exists with this email');
        error.status = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const result = await createUser(name, email, hashedPassword);
    const userId = result.insertId;

    await createDefaultCategories(userId);

    const user = {
        id: userId,
        name,
        email,
        role: "user"
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    const expiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000
    );

    await saveRefreshToken(userId, refreshToken, expiresAt);

    return {
        accessToken,
        refreshToken,
        user
    };
};

// ✅ LOGIN
const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    const expiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000
    );

    await saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "user",
        },
    };
};

// ✅ REFRESH (WITH EXPIRY CHECK + ROTATION)
const refreshAuth = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('Refresh token required');
        error.status = 400;
        throw error;
    }

    const tokenRecord = await findRefreshToken(refreshToken);

    if (!tokenRecord) {
        const error = new Error('Invalid or expired refresh token');
        error.status = 401;
        throw error;
    }

    // 🔥 expiry check
    if (new Date(tokenRecord.expires_at) < new Date()) {
        await revokeRefreshToken(refreshToken);

        const error = new Error("Refresh token expired");
        error.status = 401;
        throw error;
    }

    const user = await findUserById(tokenRecord.user_id);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    // 🔥 rotate token
    await revokeRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();

    const expiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000
    );

    await saveRefreshToken(user.id, newRefreshToken, expiresAt);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "user",
        }
    };
};

// ✅ LOGOUT
const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('Refresh token required');
        error.status = 400;
        throw error;
    }

    await revokeRefreshToken(refreshToken);

    return {
        success: true,
        message: 'Logged out successfully'
    };
};

// ✅ GOOGLE AUTH (LOGIN OR AUTO-SIGNUP)
const googleAuthService = async (idToken) => {
    const googleUser = await verifyGoogleIdToken(idToken);
    const { email, name } = googleUser;

    let user = await findUserByEmail(email);

    if (!user) {
        // Auto-provision new user with secure random password
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await hashPassword(randomPassword);

        const result = await createUser(name, email, hashedPassword);
        const userId = result.insertId;

        await createDefaultCategories(userId);

        user = {
            id: userId,
            name,
            email,
            role: "user",
        };
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    const expiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000
    );

    await saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "user",
        },
    };
};

module.exports = {
    signupUser,
    loginUser,
    refreshAuth,
    logoutUser,
    googleAuthService,
};