import type { Hono } from "hono";
import { it, describe, suite, expect, beforeEach } from "vitest";

import { type AppEnv, createApplication } from "../src/app.js";
import { createImageStorageService } from "../src/lib/factory.js";
import { StubImageRenderService } from "./helpers/stubs.js";

suite("app", () => {
  let app: Hono<AppEnv>;

  const imageStorageService = createImageStorageService();
  const imageRenderService = new StubImageRenderService();

  beforeEach(() => {
    app = createApplication(imageRenderService, imageStorageService);
  });

  describe("GET /ping", () => {
    it("success", async () => {
      const res = await app.request("/ping");
      expect(res.status).toBe(200);
      expect(await res.json()).toBe("pong");
    });
  });

  describe("GET /?url=", () => {
    it("succeeds with minimal", async () => {
      const res = await app.request("/?url=https://google.com");
      expect(res.status).toBe(200);
    });

    it("succeeds with resize", async () => {
      const res = await app.request("/?url=https://google.com&width=500&height=500");
      expect(res.status).toBe(200);
    });

    it("succeeds with uri encoded url", async () => {
      const url = encodeURIComponent("https://jasonraimondi.com");
      const res = await app.request(`/?url=${url}`);
      expect(res.status).toBe(200);
    });
  });
});
