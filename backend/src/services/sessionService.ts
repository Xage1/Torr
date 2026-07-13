import prisma from "../config/prisma.js";

export const createSession = async (
    userId: number,
    refreshToken: string,
    req: any
) => {

    return prisma.loginSession.create({
        data: {
            userId,
            refreshToken,
            ipAddress:
                req.ip ||
                req.headers["x-forwarded-for"] ||
                null,
            userAgent:
                req.headers["user-agent"] || null,
            expiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            )
        }
    });

};

export const getSessions = async (
    userId: number
) => {

    return prisma.loginSession.findMany({

        where: {
            userId
        },

        orderBy: {
            createdAt: "desc"
        }

    });

};

export const getSession = async (
    id: number
) => {

    return prisma.loginSession.findUnique({

        where: {
            id
        }

    });

};

export const revokeSession = async (
    id: number
) => {

    return prisma.loginSession.delete({

        where: {
            id
        }

    });

};

export const revokeUserSessions = async (
    userId: number
) => {

    return prisma.loginSession.deleteMany({

        where: {
            userId
        }

    });

};

export const revokeOtherSessions = async (
    userId: number,
    currentSessionId: number
) => {

    return prisma.loginSession.deleteMany({

        where: {
            userId,
            id: {
                not: currentSessionId
            }
        }

    });

};

export const cleanupExpiredSessions = async () => {

    return prisma.loginSession.deleteMany({

        where: {

            expiresAt: {
                lt: new Date()
            }

        }

    });

};