const express = require('express');
const router = express.Router();

const { setBudget, getBudget, getBudgetHistory } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Apply auth to all routes
router.use(authMiddleware);

// ➕ Set Budget
router.post('/', setBudget);

// 📊 Get Budget
router.get('/', getBudget);

// 🧾 Get budget history
router.get('/history', getBudgetHistory);

module.exports = router;