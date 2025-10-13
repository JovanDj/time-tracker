import { app } from "./app.js";
import { env } from "./env.schema.ts";

const { PORT } = env;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
