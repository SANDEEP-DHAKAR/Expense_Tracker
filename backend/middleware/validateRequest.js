const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

const badRequest = (res, errors) =>
    res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
    });

const validateSignup = (req, res, next) => {
    const { name, email, password } = req.body || {};
    const errors = [];

    if (!name || typeof name !== "string" || name.trim().length < 2) {
        errors.push("Name must be at least 2 characters");
    }
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
        errors.push("Valid email is required");
    }
    if (!password || typeof password !== "string" || password.length < 8) {
        errors.push("Password must be at least 8 characters");
    }

    if (errors.length) return badRequest(res, errors);
    return next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body || {};
    const errors = [];

    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
        errors.push("Valid email is required");
    }
    if (!password || typeof password !== "string") {
        errors.push("Password is required");
    }

    if (errors.length) return badRequest(res, errors);
    return next();
};

const validateRefreshOrLogout = (req, res, next) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken || typeof refreshToken !== "string") {
        return badRequest(res, ["refreshToken is required"]);
    }
    return next();
};

const validateExpenseBody = (req, res, next) => {
    const { amount, expenseDate, note } = req.body || {};
    const errors = [];

    if (amount === undefined || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
        errors.push("amount must be a positive number");
    }
    if (!expenseDate || typeof expenseDate !== "string" || !isoDateRegex.test(expenseDate)) {
        errors.push("expenseDate must be in YYYY-MM-DD format");
    }
    if (note && (typeof note !== "string" || note.length > 500)) {
        errors.push("note must be a string up to 500 characters");
    }

    if (errors.length) return badRequest(res, errors);
    return next();
};

const validateCategoryBody = (req, res, next) => {
    const { name } = req.body || {};
    if (!name || typeof name !== "string" || !name.trim()) {
        return badRequest(res, ["Category name is required"]);
    }
    return next();
};

const validateBudgetBody = (req, res, next) => {
    const { monthly_limit, month } = req.body || {};
    const errors = [];

    if (monthly_limit === undefined || Number.isNaN(Number(monthly_limit)) || Number(monthly_limit) <= 0) {
        errors.push("monthly_limit must be a positive number");
    }
    if (!month || typeof month !== "string" || !monthRegex.test(month)) {
        errors.push("month must be in YYYY-MM format");
    }

    if (errors.length) return badRequest(res, errors);
    return next();
};

const validateNumericIdParam = (paramKey) => (req, res, next) => {
    const value = req.params?.[paramKey];
    if (!value || Number.isNaN(Number(value)) || Number(value) <= 0) {
        return badRequest(res, [`${paramKey} must be a positive number`]);
    }
    return next();
};

module.exports = {
    validateSignup,
    validateLogin,
    validateRefreshOrLogout,
    validateExpenseBody,
    validateCategoryBody,
    validateBudgetBody,
    validateNumericIdParam,
};
