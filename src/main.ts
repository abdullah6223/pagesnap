import "dotenv/config";

import { serve } from "@hono/node-server";
import { StringEncrypter } from "@jmondi/string-encrypt-decrypt";

import { createApplication } from "./app.js";
import { BrowserPool } from "./lib/browser_pool.js";
import {
  createBrowserPool,
  createImageRenderService,
  createImageStorageService,
} from "./lib/factory.js";
import { logger } from "./lib/logger.js";

async function main() {
  const encryptionService = process.env.CRYPTO_KEY
    ? await StringEncrypter.fromCryptoString(process.env.CRYPTO_KEY)
    : undefined;

  const imageStorageService = createImageStorageService();

  const browserPool: BrowserPool = createBrowserPool();

  const imageRenderService = createImageRenderService(browserPool);

  const app = createApplication(
    browserPool,
    imageRenderService,
    imageStorageService,
    encryptionService,
  );

  const port = Number(process.env.PORT) || 3089;
  serve({ fetch: app.fetch, port });

  logger.info(`Server is running on port http://localhost:${port}/ping`);
}

main()
  .then()
  .catch(err => {
    logger.error(err);
  });
