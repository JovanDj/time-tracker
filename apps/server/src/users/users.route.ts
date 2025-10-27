import express from "express";
import { adminAuth } from "../auth/admin.middleware.ts";
import { usersController } from "./index.ts";

export const adminUserRouter = express.Router();

adminUserRouter.use(adminAuth);
adminUserRouter.get("/", usersController.index.bind(usersController));
adminUserRouter.patch("/:id", usersController.update.bind(usersController));
adminUserRouter.delete("/:id", usersController.delete.bind(usersController));
