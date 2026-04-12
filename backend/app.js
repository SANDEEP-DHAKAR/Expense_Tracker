require('dotenv').config();  // Load environment variables from .env file

const db = require('./config/db');  // Import the database connection pool (if needed for testing)

const express = require("express");
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');  // Global error handling middleware

const app = express();

// Global Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies
app.use(errorMiddleware);  // Global error handling middleware

// Health Check Route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

// DB Test Route
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ success: true, message: 'DB connected', rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Routes (future me add karenge yahan pe)
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middeware (important)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
    });
});

module.exports = app;


