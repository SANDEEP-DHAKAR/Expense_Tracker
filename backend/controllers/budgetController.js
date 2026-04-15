const {
    setBudget: saveBudget,
    getBudgetStatus,
    getBudgetHistory,
    ensureMonthlyBudget
} = require('../services/budgetService');

const setBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const { monthly_limit, month } = req.body;

        const result = await saveBudget(userId, monthly_limit, month);

        return res.status(200).json({
            success: true,
            message: 'Budget saved successfully 🚀',
            data: result
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const month = req.query.month || new Date().toISOString().slice(0, 7);

        const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
        if (!monthRegex.test(month)) {
            return res.status(400).json({
                success: false,
                message: 'Month must be in YYYY-MM format'
            });
        }

        await ensureMonthlyBudget(userId, month);
        const data = await getBudgetStatus(userId, month);

        return res.json({
            success: true,
            month,
            data
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getBudgetHistoryController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page, limit } = req.query;

        const data = await getBudgetHistory(userId, page, limit);

        return res.json({
            success: true,
            ...data
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    setBudget,
    getBudget,
    getBudgetHistory: getBudgetHistoryController
};