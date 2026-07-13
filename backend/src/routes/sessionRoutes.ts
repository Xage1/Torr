import { Router } from "express";

import {
    getSessions,
    revokeSession,
    revokeAllSessions,
    revokeOtherSessions
} from "../controllers/sessionController.js";

import authenticate from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    getSessions
);

router.delete(
    "/:id",
    revokeSession
);

router.delete(
    "/",
    revokeAllSessions
);

router.delete(
    "/others",
    revokeOtherSessions
);

export default router;