const express = require('express');
const router = express.Router();

const { setBudget, getBudget, getBudgetHistory } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBudgetBody } = require("../middleware/validateRequest");

// 🔐 Apply auth to all routes
router.use(authMiddleware);

// ➕ Set Budget
router.post('/', validateBudgetBody, setBudget);

// 📊 Get Budget
router.get('/', getBudget);

// 🧾 Get budget history
router.get('/history', getBudgetHistory);

module.exports = router;