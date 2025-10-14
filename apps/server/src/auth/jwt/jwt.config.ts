import type { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../../env.schema.js";

export const jwtConfig: {
	secret: Secret;
	expiresIn: SignOptions["expiresIn"];
} = {
	expiresIn: "1h",
	secret: env.JWT_SECRET,
};
