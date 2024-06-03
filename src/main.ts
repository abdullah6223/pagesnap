import "dotenv/config";

import { serve } from "@hono/node-server";

import { createApplication } from "./app.js";
import { logger } from "./lib/logger.js";

async function main() {
  const app = createApplication();

  const port = Number(process.env.PORT) || 3089;
  serve({ fetch: app.fetch, port });

  logger.info(`Server is running on port http://localhost:${port}/ping`);
}

main()
  .then()
  .catch(err => {
    logger.error(err);
  });
