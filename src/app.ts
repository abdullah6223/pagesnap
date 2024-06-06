import { Hono } from "hono";

import { ImageRenderInterface } from "./lib/image_render.js";
import { PlainConfigSchema } from "./lib/schema.js";
import { ImageStorage } from "./lib/storage/_base.js";
import { handleExtractQueryParamsMiddleware } from "./middlewares/extract_query_params.js";
import { getIndex } from "./routes/index.js";

export type Variables = {
  input: PlainConfigSchema;
  imageId: string;
};
export type AppEnv = { Variables: Variables };

export function createApplication(imageRenderService: ImageRenderInterface, imageStorageService: ImageStorage) {
  const app = new Hono<AppEnv>();

  app.get("/ping", c => c.json("pong"));

  app.use("/", handleExtractQueryParamsMiddleware());

  app.get("/", getIndex(imageStorageService, imageRenderService));

  return app;
}
