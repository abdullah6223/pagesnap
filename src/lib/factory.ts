import { Options } from "generic-pool";

import { BrowserPool } from "./browser_pool.js";
import { ImageRenderService } from "./image_render.js";
import { ImageStorage } from "./storage/_base.js";
import { StubStorageProvider } from "./storage/stub.js";

export function createBrowserPool(opts: Options = {}) {
  return new BrowserPool({ poolOpts: opts });
}

export function createImageRenderService(browserPool: BrowserPool) {
  const defaultConfig = {
    width: 250,
    height: 250,
  };

  return new ImageRenderService(browserPool, defaultConfig);
}

export function createImageStorageService(): ImageStorage {
  let imageStorage: ImageStorage;
  switch (process.env.STORAGE_PROVIDER) {
    case "stub":
    default:
      imageStorage = new StubStorageProvider();
  }

  return imageStorage;
}
