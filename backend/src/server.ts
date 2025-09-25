import app from "./app";
import env from "./config/env";
import prisma from "./config/prisma";

const port = env.PORT || 4000;

async function start() {
    try {
        await prisma.$connect();
        console.log("Connected to Postgres via Prisma");

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
}

start();