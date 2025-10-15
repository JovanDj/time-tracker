import { db } from "../../db.js";
import { bcryptHashing, nodeMailer } from "../../lib/index.js";
import { AuthController } from "./auth.controller.js";
import type { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { KnexAuthRepository } from "./knex-auth.repository.js";

const authRepository: AuthRepository = new KnexAuthRepository(db);
export const authService = new AuthService(authRepository, bcryptHashing);
export const authController = new AuthController(authService, nodeMailer);
