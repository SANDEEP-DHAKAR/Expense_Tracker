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

// 📥 GET EXPENSES (PAGINATION + SEARCH + FILTER + SORTING)
const getExpenses = async (
    userId,
    {
        startDate,
        endDate,
        search,
        categoryId,
        page = 1,
        limit = 10,
        sortBy = 'expense_date',
        order = 'desc'
    }
) => {
    const offset = (Number(page) > 1 ? Number(page) - 1 : 0) * Number(limit);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const allowedSortFields = ['expense_date', 'amount', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'expense_date';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let query = `
        SELECT e.*, c.name AS category_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
    `;

    let countQuery = `
        SELECT COUNT(*) as total
        FROM expenses e
        WHERE e.user_id = ?
    `;

    const params = [userId];
    const countParams = [userId];

    if (categoryId) {
        query += ` AND e.category_id = ?`;
        countQuery += ` AND e.category_id = ?`;
        params.push(categoryId);
        countParams.push(categoryId);
    }

    if (search) {
        query += ` AND (e.note LIKE ? OR c.name LIKE ?)`;
        countQuery += ` AND (e.note LIKE ? OR EXISTS (SELECT 1 FROM categories c2 WHERE c2.id = e.category_id AND c2.name LIKE ?))`;
        const searchValue = `%${search}%`;
        params.push(searchValue, searchValue);
        countParams.push(searchValue, searchValue);
    }

    if (startDate && endDate) {
        query += ` AND e.expense_date BETWEEN ? AND ?`;
        countQuery += ` AND e.expense_date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
        countParams.push(startDate, endDate);
    } else if (startDate) {
        query += ` AND e.expense_date >= ?`;
        countQuery += ` AND e.expense_date >= ?`;
        params.push(startDate);
        countParams.push(startDate);
    } else if (endDate) {
        query += ` AND e.expense_date <= ?`;
        countQuery += ` AND e.expense_date <= ?`;
        params.push(endDate);
        countParams.push(endDate);
    }

    query += ` ORDER BY e.${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    const [rows] = await db.query(query, params);
    const [countRows] = await db.query(countQuery, countParams);

    return {
        data: rows,
        total: countRows[0].total,
        page: Number(page),
        limit: pageSize
    };
};

const getExpensesForExport = async (
    userId,
    {
        startDate,
        endDate,
        search,
        categoryId,
        sortBy = 'expense_date',
        order = 'desc'
    }
) => {
    const allowedSortFields = ['expense_date', 'amount', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'expense_date';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let query = `
        SELECT e.*, c.name AS category_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
    `;

    const params = [userId];

    if (categoryId) {
        query += ` AND e.category_id = ?`;
        params.push(categoryId);
    }

    if (search) {
        query += ` AND (e.note LIKE ? OR c.name LIKE ?)`;
        const searchValue = `%${search}%`;
        params.push(searchValue, searchValue);
    }

    if (startDate && endDate) {
        query += ` AND e.expense_date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    } else if (startDate) {
        query += ` AND e.expense_date >= ?`;
        params.push(startDate);
    } else if (endDate) {
        query += ` AND e.expense_date <= ?`;
        params.push(endDate);
    }

    query += ` ORDER BY e.${sortField} ${sortOrder} LIMIT 10000`;

    const [rows] = await db.query(query, params);
    return rows;
};

const getExpensesByCategory = async (userId, categoryId) => {
    const query = `
        SELECT e.*, c.name AS category_name
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ? AND e.category_id = ?
        ORDER BY e.expense_date DESC
        LIMIT 100
    `;

    const [rows] = await db.query(query, [userId, categoryId]);
    return rows;
};

// ✏️ UPDATE EXPENSE
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

// ❌ DELETE EXPENSE
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
    getExpensesForExport,
    getExpensesByCategory,
    updateExpense,
    deleteExpense
};