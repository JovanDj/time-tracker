import passport from "passport";
import {
	ExtractJwt,
	Strategy as JwtStrategy,
	type StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { db } from "../../db.js";
import { userSchema } from "./auth-schema.js";
import { jwtConfig } from "./jwt.config.ts";

const options: StrategyOptionsWithoutRequest = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: jwtConfig.secret.toString(),
};

passport.use(
	new JwtStrategy(options, async (payload, done) => {
		try {
			const userRow: unknown = await db("users")
				.where({ id: payload.id })
				.first();

			if (!userRow) {
				return done(null, false);
			}

			const user = userSchema.parse(userRow);

			return done(null, { email: user.email, id: user.id });
		} catch (err) {
			return done(err, false);
		}
	}),
);

export default passport;
