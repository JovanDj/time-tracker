import cors from "cors";
import express from "express";
import helmet from "helmet";
import { authRouter } from "./src/auth/auth.route.js";
import passport from "./src/auth/jwt.strategy.js";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(passport.initialize());

app.get("/", (_req, res) => {
	res.send("API running");
});

app.use("/auth", authRouter);

authRouter.get(
	"/me",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.json(req.user);
	},
);
