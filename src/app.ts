import { Hono } from "hono";

import { PlainConfigSchema } from "./lib/schema.js";
import { handleExtractQueryParamsMiddleware } from "./middlewares/extract_query_params.js";

export type Variables = {
  input: PlainConfigSchema;
  imageId: string;
};
export type AppEnv = { Variables: Variables };

export function createApplication() {
  const app = new Hono<AppEnv>();

  app.get("/ping", c => c.json("pong"));

  app.use("/", handleExtractQueryParamsMiddleware());

  return app;
}
