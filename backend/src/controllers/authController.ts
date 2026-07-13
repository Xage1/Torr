import { Request, Response } from "express";
import * as authService from "../services/authService.js";
import * as twoFactorService from "../services/twoFactorService.js";
import * as sessionService from "../services/sessionService.js";

export const register = async (req: Request, res: Response) => {
    try {

        const user = await authService.register(req.body, req);

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email.",
            data: user
        });

    } catch (err: any) {

        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }
};

export const login = async (req: Request, res: Response) => {

    try {

        const result = await authService.login(req.body, req);

        return res.json({
            success: true,
            message: "Login successful.",
            data: result
        });

    } catch (err: any) {

        console.error(err);

        return res.status(401).json({
            success: false,
            message: err.message
        });

    }

};

export const logout = async (req: Request, res: Response) => {

    try {

        const auth = req as any;

        await authService.logout(auth.session.id);

        return res.json({

            success: true,

            message: "Logged out successfully."

        });

    } catch (err: any) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const refresh = async (req: Request, res: Response) => {

    try {

        const token = req.body.refreshToken;

        const tokens = await authService.refresh(token);

        return res.json({

            success: true,

            data: tokens

        });

    } catch (err: any) {

        return res.status(401).json({

            success: false,

            message: err.message

        });

    }

};

export const forgotPassword = async (req: Request, res: Response) => {

    try {

        await authService.forgotPassword(req.body.email);

        return res.json({

            success: true,

            message: "Password reset email sent."

        });

    } catch (err: any) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const resetPassword = async (req: Request, res: Response) => {

    try {

        await authService.resetPassword(

            req.body.token,

            req.body.password

        );

        return res.json({

            success: true,

            message: "Password reset successful."

        });

    } catch (err: any) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

export const verifyEmail = async (req: Request, res: Response) => {

    try {

        await authService.verifyEmail(req.body.token);

        return res.json({

            success: true,

            message: "Email verified successfully."

        });

    } catch (err: any) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

export const resendVerification = async (req: Request, res: Response) => {

    try {

        await authService.resendVerification(req.body.email);

        return res.json({

            success: true,

            message: "Verification email sent."

        });

    } catch (err: any) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const enable2FA = async (req: Request, res: Response) => {

    try {

        const auth = req as any;

        const data = await twoFactorService.enable(auth.user.id);

        return res.json({

            success: true,

            data

        });

    } catch (err: any) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const verify2FA = async (req: Request, res: Response) => {

    try {

        const auth = req as any;

        await twoFactorService.verify(

            auth.user.id,

            req.body.code

        );

        return res.json({

            success: true,

            message: "Two-factor authentication enabled."

        });

    } catch (err: any) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

export const getSessions = async (req: Request, res: Response) => {

    try {

        const auth = req as any;

        const sessions = await sessionService.getUserSessions(auth.user.id);

        return res.json({

            success: true,

            data: sessions

        });

    } catch (err: any) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const deleteSession = async (req: Request, res: Response) => {

    try {

        const auth = req as any;

        await sessionService.deleteSession(

            auth.user.id,

            Number(req.params.id)

        );

        return res.json({

            success: true,

            message: "Session revoked."

        });

    } catch (err: any) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const deleteAllSessions = async (req: Request, res: Response) => {

    try {

        const auth = req as any;

        await sessionService.deleteAllSessions(auth.user.id);

        return res.json({

            success: true,

            message: "All sessions revoked."

        });

    } catch (err: any) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};