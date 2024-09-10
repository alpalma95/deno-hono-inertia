import { Hono } from "@hono/hono";
import { createMiddleware } from "@hono/hono/factory";
import { serveStatic } from "@hono/hono/deno"


const inertiaInfo = {
  template: "",
  render<T>(component: string, props: T, url: string): string {
    const data = JSON.stringify({ component, props, url });
    const body = `<div id="app" data-page='${data}'></div>`;
    // const head = `<script> console.log("hello") </script>`;

    return inertiaInfo.template.replace("@inertiaBody", body)
  },
};

// Inertia middleware
const InertiaMiddleware = createMiddleware<{
  Variables: {
    render: <T>(component: string, props: T) => Response;
  };
}>(async (c, next) => {
  inertiaInfo.template = await Deno.readTextFile("./views/index.dev.html");

  c.set(
    "render",
    <T>(component: string, props: T): Response => {
      const transformedString = inertiaInfo.render(component, props, new URL(c.req.url).pathname);
      return c.html(transformedString);
    },
  );
  await next();
});

const app = new Hono();
app.use("/public/*", serveStatic({ root: "./"}))

app.get("/", InertiaMiddleware, (c) => {
  return c.var.render("Index", { foo: "barrrr" });
});

Deno.serve(app.fetch);
