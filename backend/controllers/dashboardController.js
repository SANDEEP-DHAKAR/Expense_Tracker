const db = require('../config/db');

// 🔥 Dashboard Summary API
exports.getDashboard = (req, res) => {
    const { userId } = req.params;

    const response = {};

    // 🧮 Total Expense
    const totalQuery = `
        SELECT SUM(amount) AS total_expense
        FROM expenses
        WHERE user_id = ?
    `;

    // 📅 Monthly Expense
    const monthlyQuery = `
        SELECT SUM(amount) AS monthly_expense
        FROM expenses
        WHERE user_id = ?
        AND MONTH(date) = MONTH(CURRENT_DATE())
        AND YEAR(date) = YEAR(CURRENT_DATE())
    `;

    // 📊 Category-wise breakdown
    const categoryQuery = `
        SELECT c.name, SUM(e.amount) AS total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
        GROUP BY c.name
    `;

    db.query(totalQuery, [userId], (err, totalResult) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        response.total_expense = totalResult[0].total_expense || 0;

        db.query(monthlyQuery, [userId], (err, monthlyResult) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            response.monthly_expense = monthlyResult[0].monthly_expense || 0;

            db.query(categoryQuery, [userId], (err, categoryResult) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                response.category_breakdown = categoryResult;

                res.json({
                    success: true,
                    data: response
                });
            });
        });
    });
};