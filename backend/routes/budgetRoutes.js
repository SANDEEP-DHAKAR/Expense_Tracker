const express = require('express');
const router = express.Router();

const { setBudget, getBudget } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

// ➕ Set Budget
router.post('/', authMiddleware, setBudget);

// 📊 Get Budget
router.get('/', authMiddleware, getBudget);

module.exports = router;