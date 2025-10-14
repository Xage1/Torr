export function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
    });
}
//# sourceMappingURL=errorHandler.js.map