import { Router } from "express";

import { authenticate } from "../middleware/authMiddleware.js";

import { authorize } from "../middleware/roleMiddleware.js";

import { dashboard } from "../controllers/adminAnalyticsController.js";

const router = Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("ADMIN"),
    dashboard
);

export default router;