const db = require('../config/db');

const saveRefreshToken = async (userId, token, expiresAt) => {
    const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at, revoked)
        VALUES (?, ?, ?, FALSE)
    `;
    const [result] = await db.query(query, [userId, token, expiresAt]);
    return result;
};

const findRefreshToken = async (token) => {
    const query = `
        SELECT * FROM refresh_tokens
        WHERE token = ?
        AND revoked = FALSE
        AND expires_at > NOW()
        LIMIT 1
    `;
    const [rows] = await db.query(query, [token]);
    return rows[0];
};

const revokeRefreshToken = async (token) => {
    const query = `
        UPDATE refresh_tokens
        SET revoked = TRUE
        WHERE token = ?
    `;
    await db.query(query, [token]);
};

const revokeAllUserRefreshTokens = async (userId) => {
    const query = `
        UPDATE refresh_tokens
        SET revoked = TRUE
        WHERE user_id = ?
    `;
    await db.query(query, [userId]);
};

module.exports = {
    saveRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
    revokeAllUserRefreshTokens
};
