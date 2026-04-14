require('dotenv').config();

const db = require('./config/db');

const express = require("express");
const cors = require('cors');

const app = express();

// 🌍 Global Middleware
app.use(cors());
app.use(express.json());

// 🏥 Health Check
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

// 🧪 DB Test
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ success: true, message: 'DB connected', rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🚀 Routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/notifications', notificationRoutes);

// ❌ 404 Handler (BONUS PRO 💀)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// 🔥 Global Error Middleware (LAST)
const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);

module.exports = app;