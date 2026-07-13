import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../config/prisma.js";
import env from "../config/env.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

function createAccessToken(userId: number) {
    return jwt.sign(
        {
            userId,
            type: "access",
        },
        env.JWT_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    );
}

function createRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

export async function generateTokens(
    userId?: number,
    sessionId?: number,
    existingRefreshToken?: string
): Promise<TokenPair> {

    if (existingRefreshToken) {

        const stored = await prisma.refreshToken.findUnique({

            where: {
                token: existingRefreshToken,
            },

            include: {
                user: true,
            },

        });

        if (!stored)
            throw new Error("Invalid refresh token.");

        if (stored.revoked)
            throw new Error("Refresh token revoked.");

        if (stored.expiresAt < new Date())
            throw new Error("Refresh token expired.");

        userId = stored.userId;
        sessionId = stored.sessionId;

        await prisma.refreshToken.update({

            where: {
                id: stored.id,
            },

            data: {
                revoked: true,
            },

        });

    }

    if (!userId)
        throw new Error("User id required.");

    const accessToken = createAccessToken(userId);

    const refreshToken = createRefreshToken();

    const expiresAt = new Date();

    expiresAt.setDate(
        expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS
    );

    await prisma.refreshToken.create({

        data: {

            token: refreshToken,

            userId,

            sessionId: sessionId ?? null,

            expiresAt,

            revoked: false,

        },

    });

    return {

        accessToken,

        refreshToken,

    };

}

export async function revokeRefreshToken(
    token: string
) {

    await prisma.refreshToken.updateMany({

        where: {
            token,
        },

        data: {
            revoked: true,
        },

    });

}

export async function revokeAllUserTokens(
    userId: number
) {

    await prisma.refreshToken.updateMany({

        where: {
            userId,
            revoked: false,
        },

        data: {
            revoked: true,
        },

    });

}

export async function verifyAccessToken(
    token: string
): Promise<JwtPayload> {

    const payload = jwt.verify(
        token,
        env.JWT_SECRET
    ) as JwtPayload;

    if (payload.type !== "access")
        throw new Error("Invalid token.");

    return payload;

}

export async function validateRefreshToken(
    token: string
) {

    const stored = await prisma.refreshToken.findUnique({

        where: {
            token,
        },

        include: {
            user: true,
            session: true,
        },

    });

    if (!stored)
        throw new Error("Refresh token not found.");

    if (stored.revoked)
        throw new Error("Refresh token revoked.");

    if (stored.expiresAt < new Date())
        throw new Error("Refresh token expired.");

    return stored;

}

export async function cleanupExpiredTokens() {

    await prisma.refreshToken.deleteMany({

        where: {

            OR: [

                {
                    expiresAt: {
                        lt: new Date(),
                    },
                },

                {
                    revoked: true,
                },

            ],

        },

    });

}