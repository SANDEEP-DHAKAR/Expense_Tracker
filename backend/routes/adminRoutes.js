const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getDashboard,
  getUsers,
  getUserDetails,
  getAllExpenses,
} = require("../controllers/adminController");
const { validateNumericIdParam } = require("../middleware/validateRequest");

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboard);
router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, validateNumericIdParam("id"), getUserDetails);
router.get("/expenses", authMiddleware, adminMiddleware, getAllExpenses);

module.exports = router;