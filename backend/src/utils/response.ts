export function success(data: any, message = "Ok") {
    return {
        status: "success",
        message,
        data,
    };
}

export function fail(message = "Failed", errors: any = null) {
    return { success: false, message, errors };
}