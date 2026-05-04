require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const db = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiters");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// ===============================
// 🔐 BASIC SETUP
// ===============================
app.disable("x-powered-by");
app.set("trust proxy", Number(process.env.TRUST_PROXY || 1));

// ===============================
// ✅ CORS FIX (FINAL)
// ===============================
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

app.options(/(.*)/, cors());

// ===============================
// 🔐 OTHER MIDDLEWARES
// ===============================
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

// 🚫 Rate limiter
app.use("/api/auth", apiLimiter);

// ===============================
// 🏥 HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ===============================
// 🧪 DB TEST
// ===============================
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ success: true, message: "DB connected", rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===============================
// 🚀 ROUTES
// ===============================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ===============================
// ❌ 404
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ===============================
// ❗ ERROR HANDLER (LAST)
// ===============================
app.use(errorMiddleware);

module.exports = app;