import passport from "passport";
import {
	Strategy as JwtStrategy,
	type StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { authService } from "../index.js";
import { userSchema } from "./../schema/auth.schema.js";
import { jwtConfig } from "./jwt.config.js";

const options: StrategyOptionsWithoutRequest = {
	jwtFromRequest: (req) => {
		return req.signedCookies?.["jwt"] ?? null;
	},
	secretOrKey: jwtConfig.secret.toString(),
};

passport.use(
	new JwtStrategy(options, async (payload, done) => {
		try {
			const userRow: unknown = await authService.findByEmail(payload.email);
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
