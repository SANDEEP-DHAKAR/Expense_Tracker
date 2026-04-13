const db = require('../config/db');

// ➕ SET / UPDATE BUDGET
const setBudget = async (req, res) => {
    try {
        const { monthly_limit, month } = req.body;
        const user_id = req.user.id;

        // ✅ Validation
        if (!monthly_limit || monthly_limit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid monthly limit required'
            });
        }

        if (!month) {
            return res.status(400).json({
                success: false,
                message: 'Month is required (YYYY-MM)'
            });
        }

        const query = `
            INSERT INTO budgets (user_id, monthly_limit, month)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE monthly_limit = ?
        `;

        await db.query(query, [user_id, monthly_limit, month, monthly_limit]);

        return res.status(200).json({
            success: true,
            message: "Budget set successfully",
            data: {
                month,
                monthly_limit
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 📥 GET BUDGET FOR A MONTH
const getBudget = async (req, res) => {
    try {
        const user_id = req.user.id;

        const month =
            req.query.month ||
            new Date().toISOString().slice(0, 7);

        const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

        if (!monthRegex.test(month)) {
            return res.status(400).json({
                success: false,
                message: 'Month must be in YYYY-MM format'
            });
        }

        const query = `
            SELECT * FROM budgets
            WHERE user_id = ? AND month = ?
        `;

        const [rows] = await db.query(query, [user_id, month]);

        return res.json({
            success: true,
            month,
            data: rows[0]
                ? {
                    ...rows[0],
                    monthly_limit: Number(rows[0].monthly_limit) 
                }
                : null
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    setBudget,
    getBudget
};