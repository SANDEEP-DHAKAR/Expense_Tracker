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
        `SELECT id, type, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
};

// 📈 GET UNREAD COUNT
const getUnreadCount = async (userId) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = FALSE`,
        [userId]
    );

    return rows[0]?.count || 0;
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
    getUnreadCount,
    markAsRead
};