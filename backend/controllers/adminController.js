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
      `SELECT e.id, e.amount, e.description, e.created_at, u.name AS user_name
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
    console.log(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};