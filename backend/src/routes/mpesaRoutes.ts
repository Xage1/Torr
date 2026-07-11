import { Router } from "express";

import { authenticate } from "../middleware/authMiddleware.js";

import { stkPush } from "../controllers/mpesaController.js";

import { mpesaCallback } from "../controllers/paymentController.js";

const router = Router();

router.post(
    "/stkpush",
    authenticate,
    stkPush
);

router.post(
    "/callback",
    mpesaCallback
);

export default router;