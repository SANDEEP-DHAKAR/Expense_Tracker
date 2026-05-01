const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');
const { validateCategoryBody, validateNumericIdParam } = require("../middleware/validateRequest");

// 🔐 Apply auth to all routes
router.use(authMiddleware);

// ➕ Create Category
router.post('/', validateCategoryBody, categoryController.createCategory);

// 📥 Get Categories (user wise)
router.get('/', categoryController.getCategories);

// ✏️ Update Category
router.put('/:id', validateNumericIdParam("id"), validateCategoryBody, categoryController.updateCategory);

// ❌ Delete Category
router.delete('/:id', validateNumericIdParam("id"), categoryController.deleteCategory);

module.exports = router;