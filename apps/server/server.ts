import { app } from "./app.js";

const { port = "3000" } = process.env;

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
