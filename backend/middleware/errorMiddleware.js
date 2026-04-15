const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err);

    const status = err?.status || 500;
    const message =
        err?.message ||
        err?.sqlMessage ||
        (typeof err === 'string' ? err : 'Internal Server Error');

    res.status(status).json({
        success: false,
        message,
    });
};

module.exports = errorMiddleware;