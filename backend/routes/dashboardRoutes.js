const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { getDashboard, getMonthlyGraph } = require('../controllers/dashboardController');

// 🔐 Auth apply
router.use(authMiddleware);

// 📊 Dashboard Summary
router.get('/', getDashboard);

// 📈 Monthly Graph
router.get('/monthly', getMonthlyGraph);

module.exports = router;