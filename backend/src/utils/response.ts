// src/utils/response.ts
export function success(data: any = null, message = "OK") {
    return { success: true, message, data };
}
export function fail(message = "Error", data: any = null) {
    return { success: false, message, data };
}