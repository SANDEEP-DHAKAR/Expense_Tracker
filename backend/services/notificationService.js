const db = require('../config/db');

// ➕ CREATE NOTIFICATION
const createNotification = async (userId, type, message) => {
    const query = `
        INSERT INTO notifications (user_id, type, message)
        VALUES (?, ?, ?)
    `;
    await db.query(query, [userId, type, message]);
};

// 📥 GET USER NOTIFICATIONS
const getNotifications = async (userId) => {
    const [rows] = await db.query(
        `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`
    , [userId]);

    return rows;
};

// ✅ MARK AS READ
const markAsRead = async (id, userId) => {
    await db.query(
        `UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?`,
        [id, userId]
    );
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead
};