const { createUser, findUserByEmail, findUserById } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { saveRefreshToken, findRefreshToken, revokeRefreshToken } = require('../models/tokenModel');
const { createDefaultCategories } = require('./categoryService');

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

    return { id: userId, name, email };
};

const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
        token,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    };
};

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

    const user = await findUserById(tokenRecord.user_id);
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    await revokeRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await saveRefreshToken(user.id, newRefreshToken, expiresAt);

    return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};

const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('Refresh token required');
        error.status = 400;
        throw error;
    }

    await revokeRefreshToken(refreshToken);
    return { success: true, message: 'Logged out successfully' };
};

module.exports = { signupUser, loginUser, refreshAuth, logoutUser };