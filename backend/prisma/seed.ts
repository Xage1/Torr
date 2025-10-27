import { whitelist } from './../src/config/whitelist';
import prisma from "../src/config/prisma.js";
import { email } from 'zod';

async function main() {
    // Seed initial whitelist entries
    const whitelistData = [
        { email: "qq27kp+admin1@gmail.com", phone: "+254745678901" },
        { email: "qq27kp+admin2@gmail.com", phone: "+254745678902" },
    ];

    for (const data of whitelistData) {
        await prisma.whitelist.upsert({
            where: { email: data.email },
            update: data,
            create: data,
        });
    }

    console.log("Whitelist seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });