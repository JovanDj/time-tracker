import type { UserSchema } from "../auth/schema/auth.schema.ts";

declare global {
	namespace Express {
		interface User extends UserSchema {}
	}
}

declare module "express-serve-static-core" {
	interface Request {
		user?: import("../auth/schema/auth.schema.js").UserSchema;
	}
}
