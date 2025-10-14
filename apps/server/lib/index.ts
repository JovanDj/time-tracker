import { BcryptHashing } from "./hashing/bcrypt-hashing.js";
import type { Hashing } from "./hashing/hashing.js";

export const bcryptHashing: Hashing = new BcryptHashing();
