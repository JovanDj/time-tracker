import type express from "express";

export const adminAuth: express.Handler = (req, res, next) => {
	const { user } = req;

	if (!user || user.roleName !== "admin") {
		return res.status(403).json({ error: "Forbidden" });
	}
	return next();
};
