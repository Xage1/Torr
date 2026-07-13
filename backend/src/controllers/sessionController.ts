import { Request, Response } from "express";
import * as sessionService from "../services/sessionService.js";

export const getSessions = async (
    req: Request,
    res: Response
) => {

    try {

        const auth = req as any;

        const sessions = await sessionService.getSessions(
            auth.user.id
        );

        return res.json({

            success: true,

            data: sessions

        });

    } catch (err: any) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const revokeSession = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid session id"

            });

        }

        await sessionService.revokeSession(id);

        return res.json({

            success: true,

            message: "Session revoked"

        });

    } catch (err: any) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const revokeAllSessions = async (
    req: Request,
    res: Response
) => {

    try {

        const auth = req as any;

        await sessionService.revokeUserSessions(
            auth.user.id
        );

        return res.json({

            success: true,

            message: "All sessions revoked"

        });

    } catch (err: any) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const revokeOtherSessions = async (
    req: Request,
    res: Response
) => {

    try {

        const auth = req as any;

        const currentSessionId = Number(
            req.headers["x-session-id"]
        );

        if (isNaN(currentSessionId)) {

            return res.status(400).json({

                success: false,

                message: "Current session id missing"

            });

        }

        await sessionService.revokeOtherSessions(

            auth.user.id,

            currentSessionId

        );

        return res.json({

            success: true,

            message: "Other sessions revoked"

        });

    } catch (err: any) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};