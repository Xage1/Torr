import { Router } from "express";
import {
    initiatePayment,
    mpesaCallback,
} from "../controllers/paymentController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post(
    "/:orderId/stk",
    authenticate,
    initiatePayment
);

router.post(
    "/callback",
    mpesaCallback
);

export default router;