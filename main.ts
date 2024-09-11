import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { webRouter } from "./routes/web.ts";

const app = new Hono();
app.route("/", webRouter);
// Must be the last middleware. Serving everything
// that is not handled by our router from public folder.
app.use("*", serveStatic({ root: "./public" }));

Deno.serve(app.fetch);
console.log("Server started in mode:", Deno.env.get("BUILD_ENV"));
