import * as genericPool from "generic-pool";
import { Factory, Options } from "generic-pool";
import { Browser, chromium } from "playwright";
import { logger } from "./logger.js";

export type BrowserPoolConstructorArgs = {
  poolOpts: Options;
  browserOpts?: never;
};

export class BrowserPool {
  private pool: genericPool.Pool<Browser>;

  private factory: Factory<Browser> = {
    async create(): Promise<Browser> {
      return await chromium.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    },
    async destroy(browser: Browser) {
      await browser.close();
    },
  };

  constructor({ poolOpts }: BrowserPoolConstructorArgs = {} as BrowserPoolConstructorArgs) {
    // I need to pull options out of here
    poolOpts = {
      max: Number(process.env.POOL_MAX) || 10,
      min: Number(process.env.POOL_MIN) || 2,
      maxWaitingClients: Number(process.env.POOL_MAX_WAITING_CLIENTS) || 50,
      idleTimeoutMillis: Number(process.env.POOL_IDLE_TIMEOUT_MS) || 15000,
      ...poolOpts,
    };
    logger.info(poolOpts);
    this.pool = genericPool.createPool<Browser>(this.factory, poolOpts);
  }

  async acquire(): Promise<Browser> {
    return await this.pool.acquire();
  }

  async release(browser: Browser): Promise<void> {
    await this.pool.release(browser);
  }

  async drain() {
    await this.pool.drain();
    await this.pool.clear();
  }
}
