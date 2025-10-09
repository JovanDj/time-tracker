import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { authRouter } from "./src/auth/auth.route.js";
import passport from "./src/auth/jwt.strategy.js";

export const app = express();

app.use(express.json());
app.use(cookieParser("secret"));

app.locals["cookieOptions"] = {
  httpOnly: true,
  maxAge: 60 * 60 * 1000,
  sameSite: "strict",
  secure: process.env["NODE_ENV"] === "production",
  signed: true,
};

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    origin: "http://localhost:4200",
  })
);

/**
 * Helmet sets the following headers by default:
 *
 * Content-Security-Policy: A powerful allow-list of what can happen on your page which mitigates many attacks
 *
 * Default Content-Secuirty-Policy:
 *   default-src 'self';
 *   base-uri 'self';
 *   font-src 'self' https: data:;
 *   form-action 'self';
 *   frame-ancestors 'self';
 *   img-src 'self' data:;
 *   object-src 'none';
 *   script-src 'self';
 *   script-src-attr 'none';
 *   style-src 'self' https: 'unsafe-inline';
 *   upgrade-insecure-requests
 *
 * Cross-Origin-Opener-Policy: Helps process-isolate your page
 * Cross-Origin-Resource-Policy: Blocks others from loading your resources cross-origin
 * Origin-Agent-Cluster: Changes process isolation to be origin-based
 * Referrer-Policy: Controls the Referer header
 * Strict-Transport-Security: Tells browsers to prefer HTTPS
 * X-Content-Type-Options: Avoids MIME sniffing
 * X-DNS-Prefetch-Control: Controls DNS prefetching
 * X-Download-Options: Forces downloads to be saved (Internet Explorer only)
 * X-Frame-Options: Legacy header that mitigates clickjacking attacks
 * X-Permitted-Cross-Domain-Policies: Controls cross-domain behavior for Adobe products, like Acrobat
 * X-Powered-By: Info about the web server. Removed because it could be used in simple attacks
 * X-XSS-Protection: Legacy header that tries to mitigate XSS attacks, but makes things worse, so Helmet disables it
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      reportOnly: true,
    },
  })
);
app.use(passport.initialize());

app.get("/", (_req, res) => {
  res.send("API running");
});

app.use("/auth", authRouter);

authRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);
