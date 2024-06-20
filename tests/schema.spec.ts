import { describe, expect, it } from "vitest";

import { MAX_DIMENSION, clampDimensions, PlainConfigSchema } from "../src/lib/schema.js";

const baseInput: PlainConfigSchema = {
  url: "https://example.com",
};

describe("clampDimensions", () => {
  it("leaves values within range untouched", () => {
    const out = clampDimensions({
      ...baseInput,
      width: 800,
      height: 600,
      viewPortWidth: 1280,
      viewPortHeight: 720,
    });
    expect(out.width).toBe(800);
    expect(out.height).toBe(600);
    expect(out.viewPortWidth).toBe(1280);
    expect(out.viewPortHeight).toBe(720);
  });

  it("clamps width and height above the max", () => {
    const out = clampDimensions({ ...baseInput, width: 5000, height: 5000 });
    expect(out.width).toBe(MAX_DIMENSION);
    expect(out.height).toBe(MAX_DIMENSION);
  });

  it("clamps viewPortWidth and viewPortHeight (not width) when they exceed the max", () => {
    const out = clampDimensions({
      ...baseInput,
      viewPortWidth: 5000,
      viewPortHeight: 5000,
    });
    expect(out.viewPortWidth).toBe(MAX_DIMENSION);
    expect(out.viewPortHeight).toBe(MAX_DIMENSION);
    expect(out.width).toBeUndefined();
    expect(out.height).toBeUndefined();
  });

  it("preserves null/undefined for absent fields", () => {
    const out = clampDimensions(baseInput);
    expect(out.width).toBeUndefined();
    expect(out.viewPortWidth).toBeUndefined();
  });
});
