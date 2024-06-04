import { BrowserPool } from "./browser_pool.js";

export type IConfigAPI = {
  width?: number | null;
  height?: number | null;
  viewPortWidth?: number | null;
  viewPortHeight?: number | null;
  isFullPage?: boolean | null;
};

export type WaitForOptions = {
  timeout: number;
  waitUntil: "load" | "domcontentloaded" | "networkidle";
};

export interface ImageRenderInterface {
  screenshot(url: string, config: IConfigAPI): Promise<Buffer>;
}

export class ImageRenderService implements ImageRenderInterface {
  private readonly NAV_OPTIONS: WaitForOptions;

  constructor(
    private readonly browserPool: BrowserPool,
    private readonly defaultConfig: IConfigAPI = {},
    navigationOptions: Partial<WaitForOptions> = {},
  ) {
    this.NAV_OPTIONS = {
      waitUntil: "domcontentloaded",
      timeout: 10000,
      ...navigationOptions,
    };
  }

  public async screenshot(url: string, config: IConfigAPI = {}): Promise<Buffer> {
    config = {
      ...this.defaultConfig,
      ...config,
    };

    const browser = await this.browserPool.acquire();

    try {
      const page = await browser.newPage({
        viewport: {
          width: config.viewPortWidth ?? 1080,
          height: config.viewPortHeight ?? 1080,
        },
      });

      try {
        await page.goto(url, this.NAV_OPTIONS);

        return await page.screenshot({ fullPage: !!config.isFullPage });
      } finally {
        await page.close();
      }
    } finally {
      await this.browserPool.release(browser);
    }
  }
}
