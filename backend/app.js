const express = require("express");
const cors = require('cors');

const app = express();

// Global Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies

// Health Check Route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

// Routes (future me add karenge yahan pe)
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

// Error Handling Middeware (important)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
    });
});

module.exports = app;


