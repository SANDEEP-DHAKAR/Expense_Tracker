const crypto = require('crypto');
const { findUserByEmail, updateUserPassword } = require('../models/userModel');
const { hashPassword } = require('../utils/hash');
const {
    createResetToken,
    findResetToken,
    markTokenAsUsed,
    revokeUserTokens
} = require('../models/passwordResetModel');
const { revokeAllUserRefreshTokens } = require('../models/tokenModel');
const { sendPasswordResetEmail } = require('../utils/sendEmail');

// Generate a random token
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const getResetLinkBaseUrl = (frontendOrigin) => {
    return (
        frontendOrigin ||
        process.env.FRONTEND_URL ||
        process.env.CLIENT_URL ||
        'http://localhost:5173'
    ).replace(/\/$/, '');
};

// ✅ FORGOT PASSWORD - Generate reset token & send email or return link
const forgotPassword = async (email, frontendOrigin) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        const error = new Error('No user account found with this email address');
        error.status = 404;
        throw error;
    }

    // Revoke any existing active tokens for this user
    await revokeUserTokens(user.id);

    // Generate fresh token
    const token = generateToken();

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to database
    await createResetToken(user.id, token, expiresAt);

    const resetLink = `${getResetLinkBaseUrl(frontendOrigin)}/reset-password?token=${token}`;

    // Send email via nodemailer if SMTP is configured
    const emailResult = await sendPasswordResetEmail({
        to: user.email,
        resetLink,
        userName: user.name,
    });

    return {
        success: true,
        message: emailResult.sent
            ? 'Password reset email sent to your inbox'
            : 'Password reset link generated successfully',
        resetToken: token,
        resetLink,
        emailSent: emailResult.sent,
    };
};

// ✅ RESET PASSWORD - Validate token and update password
const resetPassword = async (token, newPassword) => {
    if (!token || typeof token !== 'string') {
        const error = new Error('Reset token is required');
        error.status = 400;
        throw error;
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
        const error = new Error('Password must be at least 8 characters long');
        error.status = 400;
        throw error;
    }

    // Find valid token
    const tokenRecord = await findResetToken(token);

    if (!tokenRecord) {
        const error = new Error('Invalid or expired reset link. Please request a new one.');
        error.status = 400;
        throw error;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password in database
    await updateUserPassword(tokenRecord.user_id, hashedPassword);

    // Mark token as used
    await markTokenAsUsed(token);

    // Revoke all existing refresh tokens for security
    await revokeAllUserRefreshTokens(tokenRecord.user_id);

    return {
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.',
    };
};

module.exports = {
    forgotPassword,
    resetPassword
};
