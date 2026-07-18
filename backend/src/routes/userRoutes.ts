import { Router } from "express";

import {
    getUserProfile,
    updateUserProfile,
    changePassword,
    changeEmail,
    getStatistics,
    getOrders,
    getPayments,
    getInvoices,
    deleteUserAccount,
    getAllUsers,
} from "../controllers/userController.js";

import {
    authMiddleware,
    requireRole,
} from "../middleware/authMiddleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| USER PROFILE
|--------------------------------------------------------------------------
*/

router.get(
    "/profile",
    authMiddleware,
    getUserProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateUserProfile
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

router.put(
    "/change-email",
    authMiddleware,
    changeEmail
);

/*
|--------------------------------------------------------------------------
| USER DASHBOARD
|--------------------------------------------------------------------------
*/

router.get(
    "/statistics",
    authMiddleware,
    getStatistics
);

router.get(
    "/orders",
    authMiddleware,
    getOrders
);

router.get(
    "/payments",
    authMiddleware,
    getPayments
);

router.get(
    "/invoices",
    authMiddleware,
    getInvoices
);

/*
|--------------------------------------------------------------------------
| ACCOUNT
|--------------------------------------------------------------------------
*/

router.delete(
    "/account",
    authMiddleware,
    deleteUserAccount
);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.get(
    "/admin/all",
    authMiddleware,
    requireRole("ADMIN"),
    getAllUsers
);

export default router;