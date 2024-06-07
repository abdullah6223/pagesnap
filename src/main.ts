import "dotenv/config";

import { serve } from "@hono/node-server";

import { createApplication } from "./app.js";
import { BrowserPool } from "./lib/browser_pool.js";
import {
  createBrowserPool,
  createImageRenderService,
  createImageStorageService,
} from "./lib/factory.js";
import { logger } from "./lib/logger.js";

async function main() {
  const imageStorageService = createImageStorageService();

  const browserPool: BrowserPool = createBrowserPool();

  const imageRenderService = createImageRenderService(browserPool);

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
