// src/server.ts

import app from "./app.js";
import prisma from "./config/prisma.js";
import env from "./config/env.js";
import { importProductsFromAdsFile } from "./services/scraper/productImportService.js";

const port = env.PORT || 4000;

async function bootstrap() {
    try {
        // Connect to database
        await prisma.$connect();
        console.log("✅ Connected to PostgreSQL via Prisma");

        // Import scraped products on startup
        try {
            console.log("🧠 Importing scraped Jiji products...");
            const summary = await importProductsFromAdsFile();
            console.log("✅ Product import completed");
            console.table(summary);
        } catch (error) {
            console.error("⚠️ Product import failed:", error);
        }

        // Start HTTP server
        app.listen(port, () => {
            console.log("=======================================");
            console.log("🚀 TORR Backend Started Successfully");
            console.log(`🌍 Environment : ${env.NODE_ENV}`);
            console.log(`📡 Server      : http://localhost:${port}`);
            console.log(`💾 Database    : PostgreSQL + Prisma`);
            console.log(`📦 Product Sync: Enabled`);
            console.log(`💳 Daraja API  : Ready`);
            console.log("=======================================");
        });

    } catch (error) {
        console.error("❌ Server failed to start");
        console.error(error);

        try {
            await prisma.$disconnect();
        } catch {}

        process.exit(1);
    }
}

process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down server...");

    await prisma.$disconnect();

    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("\n🛑 SIGTERM received...");

    await prisma.$disconnect();

    process.exit(0);
});

bootstrap();