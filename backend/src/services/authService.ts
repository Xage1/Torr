import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { generateTokens } from "./tokenService.js";
import { createSession } from "./sessionService.js";
import { createAuditLog } from "./auditService.js";
import { sendVerificationEmail } from "./emailService.js";

export async function register(data: any, req: any) {

    const exists = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });

    if (exists) {
        throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({

        data: {

            name: data.name,

            email: data.email,

            phone: data.phone,

            passwordHash,

            EmailVerifications: {

                create: {

                    token: verificationToken,

                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)

                }

            }

        }

    });

    await sendVerificationEmail(user.email, verificationToken);

    await createAuditLog(user.id, "REGISTER", req);

    return user;
}

export async function login(data: any, req: any) {

    const user = await prisma.user.findUnique({

        where: {

            email: data.email

        }

    });

    if (!user)
        throw new Error("Invalid credentials");

    if (user.lockedUntil && user.lockedUntil > new Date()) {

        throw new Error("Account locked");

    }

    const ok = await bcrypt.compare(data.password, user.passwordHash);

    if (!ok) {

        await prisma.user.update({

            where: {

                id: user.id

            },

            data: {

                failedAttempts: {

                    increment: 1

                }

            }

        });

        throw new Error("Invalid credentials");

    }

    await prisma.user.update({

        where: {

            id: user.id

        },

        data: {

            failedAttempts: 0

        }

    });

    const session = await createSession(user, req);

    const tokens = await generateTokens(user.id, session.id);

    await createAuditLog(user.id, "LOGIN", req);

    return {

        user,

        ...tokens

    };

}

export async function refresh(refreshToken: string) {

    return generateTokens(undefined, undefined, refreshToken);

}

export async function logout(sessionId: number) {

    await prisma.loginSession.delete({

        where: {

            id: sessionId

        }

    });

}

export async function forgotPassword(email: string) {

    const user = await prisma.user.findUnique({

        where: {

            email

        }

    });

    if (!user)
        return;

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordReset.create({

        data: {

            userId: user.id,

            token,

            expiresAt: new Date(Date.now() + 3600000)

        }

    });

}

export async function resetPassword(token: string, password: string) {

    const reset = await prisma.passwordReset.findUnique({

        where: {

            token

        },

        include: {

            user: true

        }

    });

    if (!reset)
        throw new Error("Invalid token");

    const hash = await bcrypt.hash(password, 12);

    await prisma.user.update({

        where: {

            id: reset.userId

        },

        data: {

            passwordHash: hash

        }

    });

    await prisma.passwordReset.delete({

        where: {

            id: reset.id

        }

    });

}