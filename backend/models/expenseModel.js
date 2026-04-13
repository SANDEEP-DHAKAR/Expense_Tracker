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

// 📥 GET EXPENSES (PAGINATION + SEARCH + FILTER + SORTING💀)
const getExpenses = async (
    userId,
    {
        startDate,
        endDate,
        search,
        page = 1,
        limit = 10,
        sortBy = 'expense_date',
        order = 'desc'
    }
) => {

    // 🔐 Allowed fields (security 💀)
    const allowedSortFields = ['expense_date', 'amount', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'expense_date';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let query = `
        SELECT * FROM expenses
        WHERE user_id = ?
    `;

    let countQuery = `
        SELECT COUNT(*) as total
        FROM expenses
        WHERE user_id = ?
    `;

    const params = [userId];
    const countParams = [userId];

    // 🔍 SEARCH
    if (search) {
        query += ` AND note LIKE ?`;
        countQuery += ` AND note LIKE ?`;
        params.push(`%${search}%`);
        countParams.push(`%${search}%`);
    }

    // 📅 DATE FILTER
    if (startDate && endDate) {
        query += ` AND expense_date BETWEEN ? AND ?`;
        countQuery += ` AND expense_date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
        countParams.push(startDate, endDate);
    } else if (startDate) {
        query += ` AND expense_date >= ?`;
        countQuery += ` AND expense_date >= ?`;
        params.push(startDate);
        countParams.push(startDate);
    } else if (endDate) {
        query += ` AND expense_date <= ?`;
        countQuery += ` AND expense_date <= ?`;
        params.push(endDate);
        countParams.push(endDate);
    }

    // 📄 PAGINATION
    const offset = (page - 1) * limit;

    // 🔥 SORTING (NEW 💀)
    query += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    // 🧠 EXECUTE
    const [rows] = await db.query(query, params);
    const [countRows] = await db.query(countQuery, countParams);

    return {
        data: rows,
        total: countRows[0].total,
        page: Number(page),
        limit: Number(limit)
    };
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
    updateExpense,
    deleteExpense
};