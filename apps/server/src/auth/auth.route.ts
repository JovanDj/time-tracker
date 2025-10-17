import express from "express";
import { authController } from "./index.js";
import passport from "./jwt/jwt.strategy.ts";

export const authRouter = express.Router();

authRouter.post("/register", authController.register.bind(authController));
authRouter.post("/login", authController.login.bind(authController));
authRouter.delete(
	"/logout",
	passport.authenticate("jwt", { session: false }),
	authController.delete.bind(authController),
);
authRouter.post(
	"/forgot-password",
	authController.forgotPassword.bind(authController),
);
authRouter.post(
	"/reset-password",
	authController.resetPassword.bind(authController),
);

authRouter.get(
	"/me",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.json(req.user);
	},
);

authRouter.patch(
	"/me",
	passport.authenticate("jwt", { session: false }),
	authController.updateProfile.bind(authController),
);
