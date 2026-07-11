import { Router } from "express";

import { authenticate }
from "../middleware/authMiddleware.js";

import {
    downloadInvoice,
}
from "../controllers/invoiceController.js";

const router = Router();

router.get(
    "/:id/download",
    authenticate,
    downloadInvoice
);

export default router;