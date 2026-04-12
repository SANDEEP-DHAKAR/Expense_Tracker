const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    create,
    getAll,
    remove,
    edit,
    getExpensesByCategory
} = require('../controllers/expenseController');

// 🔐 Apply auth middleware to all routes
router.use(authMiddleware);

// ➕ ADD EXPENSE
router.post('/', create);

// 📥 GET ALL EXPENSES
router.get('/', getAll);

// 🔥 Get expenses with category name (👈 upar lao)
router.get('/category/:categoryId', getExpensesByCategory);

// ✏️ UPDATE EXPENSE
router.put('/:id', edit);

// ❌ DELETE EXPENSE
router.delete('/:id', remove);

module.exports = router;