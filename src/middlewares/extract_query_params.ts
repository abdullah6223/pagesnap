import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { parseForm } from "zod-ff";

import { AppEnv } from "../app.js";

import { PlainConfigSchema } from "../lib/schema.js";
import { buildImageId } from "../lib/utils.js";

function inputToParams(input: PlainConfigSchema): URLSearchParams {
  const out = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined) continue;
    out.set(key, String(value));
  }
  return out;
}

export function handleExtractQueryParamsMiddleware() {
  return async (c: Context<AppEnv>, next: () => Promise<void>) => {
    const params = new URL(c.req.url).searchParams;

    const { validData, errors } = parseForm({ data: params, schema: PlainConfigSchema });

    if (errors) {
      let message: string = "Invalid query parameters: ";

      const specificErrors = Object.entries(errors)
        .map(([key, value]) => `(${key} - ${value})`)
        .join(" ");

      message = `${message} ${specificErrors}`;

      throw new HTTPException(400, { message, cause: errors });
    }

    const imageId = buildImageId(validData.url, inputToParams(validData));

    c.set("input", validData);
    c.set("imageId", imageId);

    await next();
  };
}
