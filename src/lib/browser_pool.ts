import * as genericPool from "generic-pool";
import { Factory, Options } from "generic-pool";
import { Browser, chromium } from "playwright";

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
    poolOpts = {
      max: 10,
      min: 2,
      maxWaitingClients: 50,
      idleTimeoutMillis: 15000,
      ...poolOpts,
    };
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
