// src/server.ts
import app from "./app.js";
import prisma from "./config/prisma.js";
import env from "./config/env.js";
const port = env.PORT || 4000;
(async function start() {
    try {
        await prisma.$connect();
        console.log("Connected to Postgres via Prisma");
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    }
    catch (err) {
        console.error("Failed to start:", err);
        process.exit(1);
    }
})();
//# sourceMappingURL=server.js.map