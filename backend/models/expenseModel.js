const db = require('../config/db');

// ➕ CREATE EXPENSE
const createExpense = async (userId, categoryId, amount, note, expenseDate) => {
    const query = `
        INSERT INTO expenses (user_id, category_id, amount, note, expense_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        userId,
        categoryId,
        amount,
        note,
        expenseDate
    ]);

    return result;
};

// 📥 GET ALL EXPENSES (USER WISE)
const getExpenses = async (userId) => {
    const query = `
        SELECT * FROM expenses
        WHERE user_id = ?
        ORDER BY expense_date DESC
    `;

    const [rows] = await db.query(query, [userId]);

    return rows;
};

// ✏️ UPDATE EXPENSE (SECURE)
const updateExpense = async (id, userId, categoryId, amount, note, expenseDate) => {
    const query = `
        UPDATE expenses
        SET category_id = ?, amount = ?, note = ?, expense_date = ?
        WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.query(query, [
        categoryId,
        amount,
        note,
        expenseDate,
        id,
        userId
    ]);

    return result;
};

// ❌ DELETE EXPENSE (SECURE)
const deleteExpense = async (id, userId) => {
    const query = `
        DELETE FROM expenses
        WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.query(query, [id, userId]);

    return result;
};

module.exports = {
    createExpense,
    getExpenses,
    deleteExpense,
    updateExpense
};