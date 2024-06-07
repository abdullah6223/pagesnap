import { Options } from "generic-pool";

import { BrowserPool } from "./browser_pool.js";
import { ImageRenderService, WaitForOptions } from "./image_render.js";
import { ImageStorage } from "./storage/_base.js";
import { FileSystemStorageProvider } from "./storage/filesystem.js";
import { StubStorageProvider } from "./storage/stub.js";

export function createBrowserPool(opts: Options = {}) {
  return new BrowserPool({ poolOpts: opts });
}

export function createImageRenderService(browserPool: BrowserPool) {
  const navigationOptions: Partial<WaitForOptions> = {};
  switch (process.env.BROWSER_WAIT_UNTIL) {
    case "load":
    case "domcontentloaded":
    case "networkidle":
      navigationOptions.waitUntil = process.env.BROWSER_WAIT_UNTIL;
      break;
    default:
      break;
  }

  const defaultConfig = {
    width: 250,
    height: 250,
  };

  return new ImageRenderService(browserPool, defaultConfig, navigationOptions);
}

export function createImageStorageService(): ImageStorage {
  let imageStorage: ImageStorage;
  switch (process.env.STORAGE_PROVIDER) {
    case "filesystem":
      const filePath = process.env.IMAGE_STORAGE_PATH!;
      imageStorage = new FileSystemStorageProvider(filePath);
      break;
    case "stub":
    default:
      imageStorage = new StubStorageProvider();
  }

  return imageStorage;
}
