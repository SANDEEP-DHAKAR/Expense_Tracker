const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    create,
    getAll,
    remove,
} = require('../controllers/expenseController');

// 🔐 Apply auth middleware to all routes
router.use(authMiddleware);

// ➕ ADD EXPENSE
router.post('/', create);

// 📥 GET ALL EXPENSES
router.get('/', getAll);

// ❌ DELETE EXPENSE
router.delete('/:id', remove);

module.exports = router;