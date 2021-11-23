/* eslint-disable promise/catch-or-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const userData = [
    {
        name: "Alice1",
        email: "alice1@prisma.io",
        mobile: "9876543210",
        posts: {
            create: [
                {
                    title: "Join the Prisma Slack",
                    content: "https://slack.prisma.io",
                    published: true,
                },
            ],
        },
    },
    {
        name: "Nilu1",
        email: "nilu1@prisma.io",
        posts: {
            create: [
                {
                    title: "Follow Prisma on Twitter",
                    content: "https://www.twitter.com/prisma",
                    published: true,
                    viewCount: 42,
                },
            ],
        },
    },
    {
        name: "Mahmoud1",
        email: "mahmoud1@prisma.io",
        posts: {
            create: [
                {
                    title: "Ask a question about Prisma on GitHub",
                    content: "https://www.github.com/prisma/prisma/discussions",
                    published: true,
                    viewCount: 128,
                },
                {
                    title: "Prisma on YouTube",
                    content: "https://pris.ly/youtube",
                },
            ],
        },
    },
];

async function main() {
    console.log(`Start seeding ...`);
    for (let u of userData) {
        const user = await prisma.user.create({
            data: u,
        });
        console.log(`Created user with id: ${user.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
