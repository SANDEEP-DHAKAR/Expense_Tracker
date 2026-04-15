const {
    createCategoryService,
    getCategoriesService,
    updateCategoryService,
    deleteCategoryService
} = require('../services/categoryService');

const createCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await createCategoryService(userId, req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await getCategoriesService(userId);
        res.json(data);
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const data = await updateCategoryService(id, userId, req.body);
        res.json(data);
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const data = await deleteCategoryService(id, userId);
        res.json(data);
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};