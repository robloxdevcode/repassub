import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PURGE_USERNAMES = ["demo", "liqu_r_nuvy_1"];

async function main() {
  for (const username of PURGE_USERNAMES) {
    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    });
    if (!user) {
      console.log(`Skip — no user @${username}`);
      continue;
    }
    await prisma.user.delete({ where: { id: user.id } });
    console.log(`Deleted user @${username} and cascaded data`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
