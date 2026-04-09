const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Expense route working",
  });
});

module.exports = router;