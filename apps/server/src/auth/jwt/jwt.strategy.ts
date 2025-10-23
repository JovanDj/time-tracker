import passport from "passport";
import {
	Strategy as JwtStrategy,
	type StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { authService } from "../index.js";
import type { UserSchema } from "../schema/index.ts";
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
			const user: UserSchema | undefined = await authService.findByEmail(
				payload.email,
			);

			if (!user) {
				return done(null, false);
			}
			const { password: _, ...safeUser } = user;

			return done(null, {
				...safeUser,
			});
		} catch (err) {
			return done(err, false);
		}
	}),
);

export default passport;
