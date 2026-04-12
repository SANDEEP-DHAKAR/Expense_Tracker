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

        res.json({
            success: true,
            summary: {
                total_expense: Number(summary?.total_expense ?? 0),
                monthly_expense: Number(summary?.monthly_expense ?? 0)
            },
            category_breakdown: categoryData.map(item => ({
                name: item.name,
                total: Number(item.total ?? 0)
            })),
            recent_transactions: recent.map(item => ({
                id: item.id,
                amount: Number(item.amount),
                note: item.note,
                date: item.expense_date,
                category: item.category_name
            })),
            monthly_graph: monthlyGraph.map(item => ({
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