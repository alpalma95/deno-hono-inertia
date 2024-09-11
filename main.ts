import { Hono } from "@hono/hono";
import { createMiddleware } from "@hono/hono/factory";
import { serveStatic } from "@hono/hono/deno";

interface InertiaInterface {
  template: string | null;
  url: string;
  data: { 
     component: string,
     props: Record<string, unknown>,
     url: string,
     version: string,
   },
  transform: <T>() => string;
  render: (<T>(component: string, props: T) => Response);
}

const IntertiaHeaders = {
    INERTIA: "X-Inertia",
    INERTIA_VERSION: "X-Inertia-Version",
    INERTIA_LOCATION: "X-Inertia-Location",
    INERTIA_PARTIAL_DATA: "X-Inertia-Partial-Data",
    INERTIA_PARTIAL_COMPONENT: "X-Inertia-Partial-Component",
}

type IntertiaHeaders = typeof IntertiaHeaders;

const Inertia: InertiaInterface = {
  template: null,
  url: "",
  data: {
    component: "",
    props: {},
    url: "",
    version: "xxxx"
  },
  transform<T>(): string {
    // Keeping it in a separate method in case we need to complicate it further
    const data = JSON.stringify({ ...this.data });
    const body = `<div id="app" data-page='${data}'></div>`;
    return this.template!.replace("@inertiaBody", body);
  },
  render<T>(): Response {
    return new Response("Not implemented", { status: 501 });
  },
};

// Inertia middleware
const InertiaMiddleware = createMiddleware(async (c, next) => {
  Inertia.url = new URL(c.req.url).pathname;
  

  /**
   * Template will always be the same (at least for now).
   * We only assign it in case it's null.
   * We're not initializing it in the Inertia instance because
   * 1) We want to load it only if it's needed (i.e. if the user hits and /api endopoint)
   * we don't want to load the template.
   * 2) This allows us to potentially load a different template depending on the request.
   */
  Inertia.template ??= await Deno.readTextFile("./views/index.dev.html");
  
  Inertia.render = <T>(component: string, props: T): Response => {

    Inertia.data = {
      url: Inertia.url,
      component,
      props: props as Record<string, unknown>,
      version: "xxxx"
    }
    
    if (c.req.header(IntertiaHeaders.INERTIA)) {
      c.header(IntertiaHeaders.INERTIA, "true");
      return c.json({ ...Inertia.data })
    }
    const template = Inertia.transform();
    return c.html(template);
  },

  await next();
});

const app = new Hono();

app.use(InertiaMiddleware)

app.get("/", () => {
  return Inertia.render("Index", { pageName: "Home page" });
});

app.get("/about", () => {
  return Inertia.render("About", { pageName: "About page" });
});

// Must be the last middleware. Serving everything
// that is not handled by our router from public folder.
app.use("*", serveStatic({ root: "./public" }));

Deno.serve(app.fetch);
