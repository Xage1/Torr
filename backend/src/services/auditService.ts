import prisma from "../config/prisma.js";
import { Request } from "express";

export async function createAuditLog(
    userId: number,
    action: string,
    req: Request,
    payload?: unknown
) {
    return prisma.auditLog.create({
        data: {
            userId,
            action,
            method: req.method,
            endpoint: req.originalUrl,
            ipAddress: getIPAddress(req),
            userAgent: req.headers["user-agent"] ?? null,
            payload: payload ?? undefined,
        },
    });
}

export async function logLogin(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "LOGIN",
        req
    );
}

export async function logLogout(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "LOGOUT",
        req
    );
}

export async function logRegistration(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "REGISTER",
        req
    );
}

export async function logPasswordReset(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "PASSWORD_RESET",
        req
    );
}

export async function logEmailVerification(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "EMAIL_VERIFIED",
        req
    );
}

export async function logRefreshToken(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "TOKEN_REFRESH",
        req
    );
}

export async function logFailedLogin(
    email: string,
    req: Request
) {
    return prisma.auditLog.create({
        data: {
            action: "FAILED_LOGIN",
            endpoint: req.originalUrl,
            method: req.method,
            ipAddress: getIPAddress(req),
            userAgent: req.headers["user-agent"] ?? null,
            payload: {
                email,
            },
        },
    });
}

export async function logAccountLocked(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "ACCOUNT_LOCKED",
        req
    );
}

export async function logEnable2FA(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "ENABLE_2FA",
        req
    );
}

export async function logVerify2FA(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "VERIFY_2FA",
        req
    );
}

export async function logSessionRevoked(
    userId: number,
    sessionId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "SESSION_REVOKED",
        req,
        {
            sessionId,
        }
    );
}

export async function logAllSessionsRevoked(
    userId: number,
    req: Request
) {
    return createAuditLog(
        userId,
        "ALL_SESSIONS_REVOKED",
        req
    );
}

export async function logAdminAction(
    userId: number,
    action: string,
    req: Request,
    payload?: unknown
) {
    return createAuditLog(
        userId,
        `ADMIN_${action}`,
        req,
        payload
    );
}

export async function logPaymentEvent(
    userId: number,
    action: string,
    req: Request,
    payload?: unknown
) {
    return createAuditLog(
        userId,
        `PAYMENT_${action}`,
        req,
        payload
    );
}

export async function logOrderEvent(
    userId: number,
    action: string,
    req: Request,
    payload?: unknown
) {
    return createAuditLog(
        userId,
        `ORDER_${action}`,
        req,
        payload
    );
}

function getIPAddress(req: Request): string {

    const forwarded = req.headers["x-forwarded-for"];

    if (typeof forwarded === "string") {
        return forwarded.split(",")[0].trim();
    }

    if (Array.isArray(forwarded) && forwarded.length > 0) {
        return forwarded[0];
    }

    return req.socket.remoteAddress ?? "unknown";
}