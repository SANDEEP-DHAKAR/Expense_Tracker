const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    getAllNotifications,
    getUnreadNotificationCount,
    markNotificationRead
} = require('../controllers/notificationController');

router.use(authMiddleware);

router.get('/', getAllNotifications);
router.get('/unread-count', getUnreadNotificationCount);
router.put('/:id', markNotificationRead);
router.patch('/:id/read', markNotificationRead);

module.exports = router;