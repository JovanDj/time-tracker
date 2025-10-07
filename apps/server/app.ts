import cors from "cors";
import express from "express";
import helmet from "helmet";
import { authRouter } from "./routes/auth.route.ts";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (_req, res) => {
	res.send("API running");
});

app.use("/auth", authRouter);
