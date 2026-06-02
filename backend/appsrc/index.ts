import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./modules/auth.routes";
import crudRoutes from "./modules/crud.routes";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(","), credentials: true }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "nexus-ai-backend" }));
app.use("/api/auth", authRoutes);
app.use("/api", crudRoutes);

app.listen(env.port, "0.0.0.0", () => console.log(`Nexus AI API em ${env.port}`));
