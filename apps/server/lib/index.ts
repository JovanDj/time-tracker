import { BcryptHashing } from "./hashing/bcrypt-hashing.js";
import type { Hashing } from "./hashing/hashing.js";
import type { Mailer } from "./mailer/mailer.ts";
import { mailer } from "./mailer/node-mailer.config.js";
import { NodeMailer } from "./mailer/node-mailer.ts";

export const bcryptHashing: Hashing = new BcryptHashing();
export const nodeMailer: Mailer = new NodeMailer(mailer);
