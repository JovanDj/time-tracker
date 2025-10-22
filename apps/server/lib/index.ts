import { BcryptHashing } from "./hashing/bcrypt-hashing.js";
import type { Hashing } from "./hashing/hashing.js";
import type { Mailer } from "./mailer/mailer.ts";
import { mailerTransport } from "./mailer/node-mailer.config.js";
import { NodeMailer } from "./mailer/node-mailer.ts";

export const hashing: Hashing = new BcryptHashing();
export const mailer: Mailer = new NodeMailer(mailerTransport);
