import { Hono } from "@hono/hono";
import { Inertia, InertiaMiddleware } from "../app/middleware/inertia.ts";

const router = new Hono();

router.use(InertiaMiddleware);

router.get("/", () => {
  return Inertia.render("Index", { pageName: "Home page" });
});

router.get("/about", () => {
  return Inertia.render("About", { pageName: "About page" });
});

export { router as webRouter}

