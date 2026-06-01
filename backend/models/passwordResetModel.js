const db = require('../config/db');

// Create password reset token
const createResetToken = async (userId, token, expiresAt) => {
    const query = `
        INSERT INTO password_reset_tokens (user_id, token, expires_at, used)
        VALUES (?, ?, ?, FALSE)
    `;
    const [result] = await db.query(query, [userId, token, expiresAt]);
    return result;
};

// Find valid reset token
const findResetToken = async (token) => {
    const query = `
        SELECT prt.*, u.email, u.id as user_id
        FROM password_reset_tokens prt
        JOIN users u ON prt.user_id = u.id
        WHERE prt.token = ?
        AND prt.used = FALSE
        AND prt.expires_at > NOW()
        LIMIT 1
    `;
    const [rows] = await db.query(query, [token]);
    return rows[0];
};

// Mark token as used
const markTokenAsUsed = async (token) => {
    const query = `
        UPDATE password_reset_tokens
        SET used = TRUE
        WHERE token = ?
    `;
    await db.query(query, [token]);
};

// Revoke all tokens for a user (invalidate old tokens)
const revokeUserTokens = async (userId) => {
    const query = `
        UPDATE password_reset_tokens
        SET used = TRUE
        WHERE user_id = ? AND used = FALSE
    `;
    await db.query(query, [userId]);
};

module.exports = {
    createResetToken,
    findResetToken,
    markTokenAsUsed,
    revokeUserTokens
};