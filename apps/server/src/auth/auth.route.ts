import express from "express";
import { authController } from "./index.js";

export const authRouter = express.Router();

authRouter.post("/register", authController.register.bind(authController));
authRouter.post("/login", authController.login.bind(authController));
authRouter.delete("/logout", authController.delete.bind(authController));
