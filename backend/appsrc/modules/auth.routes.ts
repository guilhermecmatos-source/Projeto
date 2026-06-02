import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Credenciais inválidas" });
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, env.jwtSecret, { expiresIn: "1d" });
  return res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
});

router.get("/me", auth, async (req: AuthRequest, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.user!.id } });
  res.json(me);
});

export default router;
