import type { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../env.schema.ts";

export const jwtConfig: {
	secret: Secret;
	expiresIn: SignOptions["expiresIn"];
} = {
	expiresIn: "1h",
	secret: env.JWT_SECRET,
};
