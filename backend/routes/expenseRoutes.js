const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { validateExpenseBody, validateNumericIdParam } = require("../middleware/validateRequest");

const {
    create,
    getAll,
    remove,
    edit,
    getByCategory,
    exportExpenses
} = require('../controllers/expenseController');

// 🔐 Apply auth middleware to all routes
router.use(authMiddleware);

// ➕ ADD EXPENSE
router.post('/', validateExpenseBody, create);

// 📥 GET ALL EXPENSES
router.get('/', getAll);

// 📤 Export expenses
router.get('/export', exportExpenses);

// 🔥 Get expenses with category name (👈 upar lao)
router.get('/category/:categoryId', validateNumericIdParam("categoryId"), getByCategory);

// ✏️ UPDATE EXPENSE
router.put('/:id', validateNumericIdParam("id"), validateExpenseBody, edit);

// ❌ DELETE EXPENSE
router.delete('/:id', validateNumericIdParam("id"), remove);

module.exports = router;