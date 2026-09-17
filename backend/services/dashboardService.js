const db = require('../config/db');

// 🧮 TOTAL + MONTHLY (NULL SAFE)
const getDashboardSummary = async (userId) => {
    const query = `
        SELECT 
            COALESCE(SUM(amount), 0) AS total_expense,
            COALESCE(SUM(CASE 
                WHEN MONTH(expense_date) = MONTH(CURRENT_DATE())
                AND YEAR(expense_date) = YEAR(CURRENT_DATE())
                THEN amount ELSE 0 END), 0) AS monthly_expense
        FROM expenses
        WHERE user_id = ?
    `;

    const [rows] = await db.query(query, [userId]);
    return rows[0];
};

// 📊 CATEGORY BREAKDOWN (NULL SAFE)
const getCategoryBreakdown = async (userId) => {
    const query = `
        SELECT 
            c.name, 
            COALESCE(SUM(e.amount), 0) AS total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
        GROUP BY c.name
    `;

    const [rows] = await db.query(query, [userId]);
    return rows;
};

// 🆕 RECENT TRANSACTIONS
const getRecentExpenses = async (userId) => {
    const query = `
        SELECT 
            e.id,
            e.amount,
            e.note,
            e.expense_date,
            c.name AS category_name
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
        ORDER BY e.expense_date DESC
        LIMIT 5
    `;

    const [rows] = await db.query(query, [userId]);
    return rows;
};

// 📊 MONTHLY GRAPH DATA (WITH BUDGET & SAVINGS COMPARISON)
const getMonthlyData = async (userId) => {
    const query = `
        SELECT 
            all_months.month,
            COALESCE(SUM(e.amount), 0) AS total,
            COALESCE(b.monthly_limit, 0) AS budget,
            CASE 
                WHEN COALESCE(b.monthly_limit, 0) > 0 
                THEN (b.monthly_limit - COALESCE(SUM(e.amount), 0))
                ELSE 0 
            END AS savings
        FROM (
            SELECT DISTINCT DATE_FORMAT(expense_date, '%Y-%m') AS month FROM expenses WHERE user_id = ?
            UNION
            SELECT DISTINCT month FROM budgets WHERE user_id = ?
        ) all_months
        LEFT JOIN budgets b ON b.month = all_months.month AND b.user_id = ?
        LEFT JOIN expenses e ON DATE_FORMAT(e.expense_date, '%Y-%m') = all_months.month AND e.user_id = ?
        GROUP BY all_months.month, b.monthly_limit
        ORDER BY all_months.month ASC
    `;

    const [rows] = await db.query(query, [userId, userId, userId, userId]);
    return rows;
};

module.exports = {
    getDashboardSummary,
    getCategoryBreakdown,
    getRecentExpenses,
    getMonthlyData
};