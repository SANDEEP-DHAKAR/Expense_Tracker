const {
    getDashboardSummary,
    getCategoryBreakdown,
    getRecentExpenses,
    getMonthlyData
} = require('../services/dashboardService');

const { getBudgetStatus } = require('../services/budgetService'); // 🔥 IMPORTANT

// 🧾 Dashboard Controller
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // 🔥 Parallel calls (FAST 💀)
        const [
            summary,
            categoryData,
            recent,
            monthlyGraph,
            budgetStatus
        ] = await Promise.all([
            getDashboardSummary(userId),
            getCategoryBreakdown(userId),
            getRecentExpenses(userId),
            getMonthlyData(userId),
            getBudgetStatus(userId)
        ]);

        res.json({
            success: true,

            // 📊 SUMMARY
            summary: {
                total_expense: Number(summary?.total_expense ?? 0),
                monthly_expense: Number(summary?.monthly_expense ?? 0)
            },

            // 📂 CATEGORY BREAKDOWN
            category_breakdown: categoryData.map(item => ({
                name: item.name,
                total: Number(item.total ?? 0)
            })),

            // 🧾 RECENT TRANSACTIONS
            recent_transactions: recent.map(item => ({
                id: item.id,
                amount: Number(item.amount),
                note: item.note,
                date: item.expense_date,
                category: item.category_name
            })),

            // 📈 MONTHLY GRAPH (WITH BUDGET & SAVINGS)
            monthly_graph: monthlyGraph.map(item => ({
                month: item.month,
                total: Number(item.total ?? 0),
                budget: Number(item.budget ?? 0),
                savings: Number(item.savings ?? 0)
            })),

            // 💰 BUDGET + ALERT 🚨
            budget: budgetStatus
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 📊 Separate Monthly Graph API
const getMonthlyGraph = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await getMonthlyData(userId);

        res.json({
            success: true,
            data: data.map(item => ({
                month: item.month,
                total: Number(item.total ?? 0),
                budget: Number(item.budget ?? 0),
                savings: Number(item.savings ?? 0)
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