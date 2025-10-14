export function success(data, message = "Ok") {
    return {
        status: "success",
        message,
        data,
    };
}
export function fail(message = "Failed", errors = null) {
    return { success: false, message, errors };
}
//# sourceMappingURL=response.js.map