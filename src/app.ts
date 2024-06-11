import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { ContentfulStatusCode } from "hono/utils/http-status";

import { ImageRenderInterface } from "./lib/image_render.js";
import { logger } from "./lib/logger.js";
import { PlainConfigSchema } from "./lib/schema.js";
import { ImageStorage } from "./lib/storage/_base.js";
import { handleAllowListMiddleware } from "./middlewares/allow_list.js";
import { handleBlockListMiddleware } from "./middlewares/block_list.js";
import { handleExtractQueryParamsMiddleware } from "./middlewares/extract_query_params.js";
import { getIndex } from "./routes/index.js";

export type Variables = {
  input: PlainConfigSchema;
  imageId: string;
};
export type AppEnv = { Variables: Variables };

export function createApplication(imageRenderService: ImageRenderInterface, imageStorageService: ImageStorage) {
  const app = new Hono<AppEnv>();

  app.use(secureHeaders());

  app.get("/ping", c => c.json("pong"));

  app.onError((err, c) => {
    let status: ContentfulStatusCode = 500;
    if ("status" in err && typeof err.status === "number") {
      status = err.status as ContentfulStatusCode;
    }
    return c.json({ message: err.message }, status);
  });

  app.use("/", handleExtractQueryParamsMiddleware());

  if (process.env.BLOCK_LIST && process.env.BLOCK_LIST.trim() !== "") {
    const allowList = process.env.BLOCK_LIST.split(",").map(url => {
      url = url.trim().replace(/https?:\/\//g, "");
      return new URL(`http://${url}`).host;
    });
    logger.info(`Blocked Domains: ${allowList.join(", ")}`);
    app.use("/", handleBlockListMiddleware(allowList));
  }

  if (process.env.ALLOW_LIST && process.env.ALLOW_LIST.trim() !== "") {
    const allowList = process.env.ALLOW_LIST.split(",").map(url => {
      url = url.trim().replace(/https?:\/\//g, "");
      return new URL(`http://${url}`).host;
    });
    logger.info(`Allowed Domains: ${allowList.join(", ")}`);
    app.use("/", handleAllowListMiddleware(allowList));
  }

  app.get("/", getIndex(imageStorageService, imageRenderService));

  return app;
}
