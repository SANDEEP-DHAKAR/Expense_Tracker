const db = require('../config/db');

const {
    getDashboardSummary,
    getCategoryBreakdown,
    getRecentExpenses,
    getMonthlyData
} = require('../services/dashboardService');

// 🧾 Dashboard Controller
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const summary = await getDashboardSummary(userId);
        const categoryData = await getCategoryBreakdown(userId);
        const recent = await getRecentExpenses(userId);
        const monthlyGraph = await getMonthlyData(userId);

        const currentMonth = new Date().toISOString().slice(0, 7);

        // 🔥 =========================
        // 💰 BUDGET FETCH
        // 🔥 =========================
        const [budgetRows] = await db.query(
            `SELECT monthly_limit FROM budgets WHERE user_id = ? AND month = ?`,
            [userId, currentMonth]
        );

        let budget = 0;
        let budgetAvailable = false;

        if (budgetRows.length > 0) {
            budget = Number(budgetRows[0].monthly_limit);
            budgetAvailable = true;
        }

        // 🔥 =========================
        // 📊 CALCULATIONS
        // 🔥 =========================
        const totalExpense = Number(summary?.monthly_expense ?? 0);

        let remaining = budget - totalExpense;
        let percentage = 0;

        if (budget > 0) {
            percentage = (totalExpense / budget) * 100;
        }

        let status = "safe";

        if (percentage >= 100) {
            status = "exceeded";
        } else if (percentage >= 80) {
            status = "warning";
        }

        // 🔥 =========================

        res.json({
            success: true,

            // 📊 SUMMARY
            summary: {
                total_expense: Number(summary?.total_expense ?? 0),
                monthly_expense: totalExpense
            },

            // 📂 CATEGORY
            category_breakdown: categoryData.map(item => ({
                name: item.name,
                total: Number(item.total ?? 0)
            })),

            // 🧾 RECENT
            recent_transactions: recent.map(item => ({
                id: item.id,
                amount: Number(item.amount),
                note: item.note,
                date: item.expense_date,
                category: item.category_name
            })),

            // 📈 GRAPH
            monthly_graph: monthlyGraph.map(item => ({
                month: item.month,
                total: Number(item.total ?? 0)
            })),

            // 💰 NEW BUDGET DATA (🔥 IMPORTANT)
            budget: {
                amount: budget,
                remaining,
                percentage: Math.min(percentage, 100),
                status, // safe | warning | exceeded
                available: budgetAvailable
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 📊 Monthly Graph Separate API
const getMonthlyGraph = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await getMonthlyData(userId);

        res.json({
            success: true,
            data: data.map(item => ({
                month: item.month,
                total: Number(item.total ?? 0)
            }))
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboard,
    getMonthlyGraph
};