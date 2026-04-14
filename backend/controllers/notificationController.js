const {
    getNotifications,
    markAsRead
} = require('../services/notificationService');

// 📥 GET ALL
const getAllNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await getNotifications(userId);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ MARK AS READ
const markNotificationRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        await markAsRead(id, userId);

        res.json({
            success: true,
            message: 'Notification marked as read'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllNotifications,
    markNotificationRead
};