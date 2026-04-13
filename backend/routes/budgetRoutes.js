const express = require('express');
const router = express.Router();

const { setBudget, getBudget } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Apply auth to all routes
router.use(authMiddleware);

// ➕ Set Budget
router.post('/', setBudget);

// 📊 Get Budget
router.get('/', getBudget);

module.exports = router;