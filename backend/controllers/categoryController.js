const db = require('../config/db');

// 🥇 Create Category
exports.createCategory = (req, res) => {
    const { user_id, name } = req.body;

    const query = "INSERT INTO categories (user_id, name) VALUES (?, ?)";

    db.query(query, [user_id, name], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        res.json({
            success: true,
            message: "Category created successfully",
            id: result.insertId
        });
    });
};

// 🥈 Get Categories by User
exports.getCategoriesByUser = (req, res) => {
    const { userId } = req.params;

    const query = "SELECT * FROM categories WHERE user_id = ?";

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        res.json({
            success: true,
            data: results
        });
    });
};

// 🥉 Delete Category
exports.deleteCategory = (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM categories WHERE id = ?";

    db.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        res.json({
            success: true,
            message: "Category deleted successfully"
        });
    });
};