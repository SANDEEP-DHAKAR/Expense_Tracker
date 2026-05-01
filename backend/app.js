require('dotenv').config();

const db = require('./config/db');

const express = require("express");
const cors = require('cors');
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiters");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", Number(process.env.TRUST_PROXY || 1));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:4174",
];

const corsOrigins = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;

// 🌍 Global Middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || corsOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS origin not allowed"), false);
    },
    credentials: true,
}));
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));
app.use("/api", apiLimiter);

// 🏥 Health Check
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// 🧪 DB Test
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ success: true, message: 'DB connected', rows });
    } catch (error) {
        console.error('DB Test Error:', error);
        const errorMessage = error?.message || error?.sqlMessage || String(error);
        res.status(500).json({ success: false, error: errorMessage });
    }
});

// 🚀 Routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use("/api/protected", protectedRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

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