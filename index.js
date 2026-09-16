import express from "express";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

app.post("/tasks", async (req, res) => {
  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      completed: req.body.completed ?? false,
    },
  });
  res.status(201).json(task);
});

app.put("/tasks/:id", async (req, res) => {
  const task = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: {
      title: req.body.title,
      completed: req.body.completed,
    },
  });
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const task = await prisma.task.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: "Task deleted successfully", task });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
