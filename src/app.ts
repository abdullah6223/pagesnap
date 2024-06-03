import { Hono } from "hono";

export function createApplication() {
  const app = new Hono();

  app.get("/ping", c => c.json("pong"));

  return app;
}
