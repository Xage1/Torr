// src/routes/adminAnalyticsRoutes.ts

import { Router } from "express";
import {
    dashboard,
    salesByCategory,
    dailyRevenue,
    topCustomers,
    inventoryHealth,
    scraperAnalytics
} from "../controllers/adminAnalyticsController.js";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("ADMIN"),
    dashboard
);

router.get(
    "/sales-category",
    authenticate,
    authorize("ADMIN"),
    salesByCategory
);

router.get(
    "/daily-revenue",
    authenticate,
    authorize("ADMIN"),
    dailyRevenue
);

router.get(
    "/top-customers",
    authenticate,
    authorize("ADMIN"),
    topCustomers
);

router.get(
    "/inventory",
    authenticate,
    authorize("ADMIN"),
    inventoryHealth
);

router.get(
    "/scraper",
    authenticate,
    authorize("ADMIN"),
    scraperAnalytics
);

export default router;