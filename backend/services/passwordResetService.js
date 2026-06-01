const crypto = require('crypto');
const { findUserByEmail, updateUserPassword } = require('../models/userModel');
const { hashPassword } = require('../utils/hash');
const {
    createResetToken,
    findResetToken,
    markTokenAsUsed,
    revokeUserTokens
} = require('../models/passwordResetModel');

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

// ✅ FORGOT PASSWORD - Generate reset token
const forgotPassword = async (email, frontendOrigin) => {
    // Find user by email
    const user = await findUserByEmail(email);

    if (!user) {
        // Don't reveal if user exists or not for security
        return {
            message: 'If an account exists with this email, a password reset link has been sent.'
        };
    }

    // Revoke any existing tokens for this user
    await revokeUserTokens(user.id);

    // Generate token
    const token = generateToken();

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to database
    await createResetToken(user.id, token, expiresAt);

    // In a real application, you would send an email with the reset link
    // For now, we'll return the token (for development/testing purposes)
    // TODO: Implement email sending with nodemailer or similar service
    
    return {
        message: 'Password reset link generated successfully',
        // In production, remove this token from response and send via email
        resetToken: token,
        // This would be the email link in production
        resetLink: `${getResetLinkBaseUrl(frontendOrigin)}/reset-password?token=${token}`
    };
};

// ✅ RESET PASSWORD - Validate token and update password
const resetPassword = async (token, newPassword) => {
    // Find valid token
    const tokenRecord = await findResetToken(token);

    if (!tokenRecord) {
        const error = new Error('Invalid or expired reset token');
        error.status = 400;
        throw error;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await updateUserPassword(tokenRecord.user_id, hashedPassword);

    // Mark token as used
    await markTokenAsUsed(token);

    // Note: In production, you may want to revoke all refresh tokens for this user
    // to force them to re-login after password reset

    return {
        message: 'Password reset successfully'
    };
};

module.exports = {
    forgotPassword,
    resetPassword
};
