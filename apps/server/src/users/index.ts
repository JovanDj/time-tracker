import { db } from "../../db.ts";
import { UsersController } from "./users.controller.ts";
import { UsersService } from "./users.service.ts";

const usersService = new UsersService(db);
export const usersController = new UsersController(usersService);
