export function errorHandler(err, _req, res, _next) {
    console.error("Unhandled error:", err);
    res.status(err?.status || 500).json({
        success: false,
        message: err?.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" ? { stack: err?.stack } : {}),
    });
}
//# sourceMappingURL=errorHandler.js.map