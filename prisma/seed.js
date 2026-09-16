import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import task from "./task.json" with { type: "json" };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

await prisma.task.createMany({
  data: task,
});

console.log("Seed data inserted successfully.");

await prisma.$disconnect();
