// src/utils/response.ts
export function success(data = null, message = "OK") {
    return { success: true, message, data };
}
export function fail(message = "Error", data = null) {
    return { success: false, message, data };
}
//# sourceMappingURL=response.js.map