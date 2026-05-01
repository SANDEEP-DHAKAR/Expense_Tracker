// routes/protectedRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Protected data accessed",
        user: req.user
    });
});

module.exports = router;