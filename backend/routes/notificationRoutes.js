const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    getAllNotifications,
    markNotificationRead
} = require('../controllers/notificationController');

router.use(authMiddleware);

router.get('/', getAllNotifications);
router.put('/:id', markNotificationRead);
router.patch('/:id/read', markNotificationRead);

module.exports = router;