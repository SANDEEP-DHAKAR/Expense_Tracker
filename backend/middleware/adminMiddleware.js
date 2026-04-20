module.exports = (req, res, next) => {
  try {
    // ❌ user missing
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found in request",
      });
    }

    // ❌ role missing ya admin nahi hai
    if (!req.user.role || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // ✅ access granted
    next();

  } catch (error) {
    console.log("Admin Middleware Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error in admin middleware",
    });
  }
};