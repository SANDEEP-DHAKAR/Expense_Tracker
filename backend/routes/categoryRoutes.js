const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');

// 🔐 Apply auth to all routes
router.use(authMiddleware);

// ➕ Create Category
router.post('/', categoryController.createCategory);

// 📥 Get Categories (user wise)
router.get('/', categoryController.getCategories);

// ✏️ Update Category
router.put('/:id', categoryController.updateCategory);

// ❌ Delete Category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;