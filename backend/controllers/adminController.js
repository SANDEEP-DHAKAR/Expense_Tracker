const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    // 1. Total users
    const [users] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    // 2. Total expenses
    const [expenses] = await db.query(
      "SELECT COALESCE(SUM(amount),0) AS totalExpenses FROM expenses"
    );

    // 3. Total categories
    const [categories] = await db.query(
      "SELECT COUNT(*) AS totalCategories FROM categories"
    );

    // 4. Recent expenses
    const [recentExpenses] = await db.query(
      `SELECT e.id, e.amount, e.note, e.created_at, u.name AS user_name
       FROM expenses e
       JOIN users u ON e.user_id = u.id
       ORDER BY e.created_at DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        totalUsers: users[0].totalUsers,
        totalExpenses: expenses[0].totalExpenses,
        totalCategories: categories[0].totalCategories,
        recentExpenses,
      },
    });
  } catch (err) {
    console.error("Admin dashboard error:", err.message);
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        COALESCE(ex.expensesCount, 0) AS expensesCount,
        COALESCE(ex.totalSpent, 0) AS totalSpent,
        COALESCE(cat.categoriesCount, 0) AS categoriesCount
      FROM users u
      LEFT JOIN (
        SELECT user_id, COUNT(*) AS expensesCount, COALESCE(SUM(amount), 0) AS totalSpent
        FROM expenses
        GROUP BY user_id
      ) ex ON ex.user_id = u.id
      LEFT JOIN (
        SELECT user_id, COUNT(*) AS categoriesCount
        FROM categories
        GROUP BY user_id
      ) cat ON cat.user_id = u.id
      ORDER BY u.created_at DESC`
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("Admin users list error:", err.message);
    res.status(500).json({ success: false, message: "Users fetch failed" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid user id is required",
      });
    }

    const [userRows] = await db.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (!userRows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [budgetRows] = await db.query(
      `SELECT month, monthly_limit, created_at, updated_at
       FROM budgets
       WHERE user_id = ?
       ORDER BY month DESC
       LIMIT 12`,
      [userId]
    );

    const [categoryRows] = await db.query(
      `SELECT id, name, created_at
       FROM categories
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    const [expenseRows] = await db.query(
      `SELECT e.id, e.amount, e.note, e.expense_date, e.created_at, c.name AS category_name
       FROM expenses e
       LEFT JOIN categories c ON c.id = e.category_id
       WHERE e.user_id = ?
       ORDER BY e.created_at DESC
       LIMIT 100`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        user: userRows[0],
        budgets: budgetRows,
        categories: categoryRows,
        recentExpenses: expenseRows,
      },
    });
  } catch (err) {
    console.error("Admin user detail error:", err.message);
    res.status(500).json({ success: false, message: "User detail fetch failed" });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        e.id,
        e.user_id,
        u.name AS user_name,
        u.email AS user_email,
        e.amount,
        e.note,
        e.expense_date,
        e.created_at,
        c.name AS category_name
      FROM expenses e
      JOIN users u ON u.id = e.user_id
      LEFT JOIN categories c ON c.id = e.category_id
      ORDER BY e.created_at DESC
      LIMIT 500`
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("Admin all expenses error:", err.message);
    res.status(500).json({ success: false, message: "Expenses fetch failed" });
  }
};