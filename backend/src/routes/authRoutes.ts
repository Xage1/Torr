import { Router } from "express";

import * as authController from "../controllers/authController.js";

import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Authentication
|--------------------------------------------------------------------------
*/

router.post(
    "/register",
    authController.register
);

router.post(
    "/login",
    authController.login
);

router.post(
    "/refresh",
    authController.refresh
);

router.post(
    "/forgot-password",
    authController.forgotPassword
);

router.post(
    "/reset-password",
    authController.resetPassword
);

router.post(
    "/verify-email",
    authController.verifyEmail
);

router.post(
    "/resend-verification",
    authController.resendVerification
);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/logout",
    authenticate,
    authController.logout
);

router.post(
    "/enable-2fa",
    authenticate,
    authController.enable2FA
);

router.post(
    "/verify-2fa",
    authenticate,
    authController.verify2FA
);

/*
|--------------------------------------------------------------------------
| Session Management
|--------------------------------------------------------------------------
*/

router.get(
    "/sessions",
    authenticate,
    authController.getSessions
);

router.delete(
    "/sessions",
    authenticate,
    authController.deleteAllSessions
);

router.delete(
    "/sessions/:id",
    authenticate,
    authController.deleteSession
);

export default router;