import bcrypt from "bcrypt";
import type { Hashing } from "./hashing.js";

export class BcryptHashing implements Hashing {
	async hash(value: string): Promise<string> {
		const salt: string = await bcrypt.genSalt();
		return bcrypt.hash(value, salt);
	}

	async compare(value: string, hash: string): Promise<boolean> {
		return bcrypt.compare(value, hash);
	}
}
