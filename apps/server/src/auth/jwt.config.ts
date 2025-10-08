import type { Secret, SignOptions } from "jsonwebtoken";

export const jwtConfig: {
	secret: Secret;
	expiresIn: SignOptions["expiresIn"];
} = {
	expiresIn: "1h",
	secret: process.env["JWT_SECRET"] ?? "dev-secret",
};
