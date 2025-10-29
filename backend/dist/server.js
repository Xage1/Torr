// src/server.ts
import app from "./app.js";
import prisma from "./config/prisma.js";
import env from "./config/env.js";
import { importProductsFromAdsFile } from "./services/scraper/productImportService.js";
const port = env.PORT || 4000;
(async function start() {
    try {
        await prisma.$connect();
        console.log("Connected to Postgres via Prisma");
        // ─────────────────────────────────────────────
        // 🧩 Run scraper import automatically on startup
        // ─────────────────────────────────────────────
        try {
            console.log("🧠 Importing scraped products before starting server...");
            const summary = await importProductsFromAdsFile();
            console.log("✅ Product import completed:", summary);
        }
        catch (scrapeErr) {
            console.warn("⚠️ Scraper import skipped or failed:", scrapeErr);
        }
        // ─────────────────────────────────────────────
        // 🚀 Start Express server
        // ─────────────────────────────────────────────
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    }
    catch (err) {
        console.error("❌ Failed to start:", err);
        process.exit(1);
    }
})();
//# sourceMappingURL=server.js.map