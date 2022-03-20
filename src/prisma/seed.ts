import { prisma } from "../prisma/client";

async function main() {
  console.log("seeding...");

  await prisma; // TODO
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
