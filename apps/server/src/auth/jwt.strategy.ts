import passport from "passport";
import {
	Strategy as JwtStrategy,
	type StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { db } from "../../db.js";
import { userSchema } from "./auth-schema.js";
import { jwtConfig } from "./jwt.config.ts";

const options: StrategyOptionsWithoutRequest = {
	jwtFromRequest: (req) => {
		return req.signedCookies?.["jwt"] ?? null;
	},
	secretOrKey: jwtConfig.secret.toString(),
};

passport.use(
	new JwtStrategy(options, async (payload, done) => {
		try {
			const userRow: unknown = await db("users")
				.join("roles", "users.role_id", "roles.id")
				.select(
					"users.id",
					"users.email",
					"users.password",
					"users.created_at",
					"users.updated_at",
					"roles.name as role_name",
				)
				.where({ "users.id": payload.id })
				.first();

			const user = userSchema.parse(userRow);

			return done(null, {
				createdAt: user.created_at,
				email: user.email,
				id: user.id,
				roleName: user.role_name,
				updatedAt: user.updated_at,
			});
		} catch (err) {
			return done(err, false);
		}
	}),
);

export default passport;
