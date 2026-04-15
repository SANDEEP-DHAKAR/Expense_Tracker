const {
    addExpense,
    fetchExpenses,
    exportExpenses: exportExpensesService,
    removeExpense,
    editExpense,
    fetchExpensesByCategory
} = require("../services/expenseService");

// ➕ CREATE EXPENSE
const create = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await addExpense(userId, req.body);

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: result
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// 📥 GET ALL EXPENSES (FILTER + PAGINATION)
const getAll = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await fetchExpenses(userId, req.query);

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// 📊 GET EXPENSES BY CATEGORY
const getByCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const categoryId = req.params.categoryId;

        const result = await fetchExpensesByCategory(userId, categoryId);

        return res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// ✏️ UPDATE EXPENSE
const edit = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;

        const result = await editExpense(expenseId, userId, req.body);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// 📤 EXPORT EXPENSES
const exportExpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await exportExpensesService(userId, req.query);

        const header = [
            'Expense ID',
            'Amount',
            'Note',
            'Category',
            'Expense Date',
            'Created At'
        ];

        const rows = data.map((row) => [
            row.id,
            row.amount,
            row.note || '',
            row.category_name || '',
            row.expense_date ? row.expense_date.toISOString().slice(0, 10) : '',
            row.created_at ? new Date(row.created_at).toISOString() : ''
        ]);

        const csv = [header, ...rows]
            .map((line) => line.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="expenses-export.csv"');
        res.send(csv);
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

// ❌ DELETE EXPENSE
const remove = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;

        const result = await removeExpense(expenseId, userId);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    create,
    getAll,
    exportExpenses,
    remove,
    edit,
    getByCategory
};