import "dotenv/config";

import { serve } from "@hono/node-server";

import { createApplication } from "./app.js";
import { BrowserPool } from "./lib/browser_pool.js";
import { ImageRenderService } from "./lib/image_render.js";
import { logger } from "./lib/logger.js";
import { StubStorageProvider } from "./lib/storage/stub.js";

async function main() {
  const imageStorageService = new StubStorageProvider();

  const browserPool: BrowserPool = new BrowserPool();

  const imageRenderService = new ImageRenderService(browserPool);

  const app = createApplication(imageRenderService, imageStorageService);

  const port = Number(process.env.PORT) || 3089;
  serve({ fetch: app.fetch, port });

  logger.info(`Server is running on port http://localhost:${port}/ping`);
}

main()
  .then()
  .catch(err => {
    logger.error(err);
  });
