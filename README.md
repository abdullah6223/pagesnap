# PageSnap

PageSnap is a self-hosted HTTP service that turns any web page URL into a PNG screenshot, with optional caching in S3, CouchDB or the local filesystem.

## What This Project Does

Many apps need a picture of a web page: link previews, thumbnails in dashboards, social cards or visual archives. Taking those screenshots means running a headless browser, which is heavy to embed in every app. PageSnap runs that browser once as a small service. You send it a URL in a query string, and it returns an image.

It is meant for developers who want a screenshot endpoint they can run on their own infrastructure, in Docker or directly with Node.js.

Main features:

- **URL to PNG over HTTP**: `GET /?url=https://example.com` returns a PNG image.
- **Configurable rendering**: output `width`/`height`, browser `viewportWidth`/`viewportHeight`, full-page capture, mobile emulation, dark mode and device scale factor, all as query parameters.
- **Sensible limits**: every dimension is capped at 1920px, and only `http`/`https` URLs are accepted.
- **Pluggable image cache**: store rendered images in Amazon S3 (or any S3-compatible store such as MinIO), CouchDB or the local filesystem, or turn caching off with the stub provider.
- **Browser pool**: Chromium instances are reused through a configurable pool instead of launched per request.
- **Domain allow and block lists**: restrict which hosts may be screenshotted.
- **Encrypted requests**: optionally require all request options to arrive as one AES-GCM encrypted `hash` parameter, so clients cannot change the options.
- **Health and metrics endpoints**: `GET /ping` and an optional `GET /metrics` that reports browser pool usage.
- **Usable as a library**: `src/mod.ts` exports the render service, browser pool, schema and storage providers.

## Usage

Install dependencies and the Chromium browser used for rendering:

```bash
pnpm install
pnpm exec playwright install chromium
```

Start the server in watch mode:

```bash
pnpm dev
```

Then request a screenshot:

```
http://localhost:3089/?url=https://example.com
http://localhost:3089/?url=https://example.com&width=600&isFullPage=true
```

Configuration is read from environment variables. Copy `.env.sample` to `.env` and adjust it.

## Storage Providers

Rendered images can be cached so the same request is not rendered twice. Pick a provider with `STORAGE_PROVIDER`:

| Provider | Value | Settings |
|---|---|---|
| None (default) | `stub` | none |
| Local directory | `filesystem` | `IMAGE_STORAGE_PATH` |
| Amazon S3 / S3-compatible | `s3` | `AWS_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_ENDPOINT_URL_S3`, `AWS_FORCE_PATH_STYLE` |
| CouchDB | `couchdb` | `COUCH_DB_PROTOCOL`, `COUCH_DB_HOST`, `COUCH_DB_PORT`, `COUCH_DB_USER`, `COUCH_DB_PASS` |

## Encryption

Set `CRYPTO_KEY` to an AES-GCM key in JWK JSON format to turn on encryption mode. The server then rejects plain query parameters, and every request must send its options as one encrypted value:

```
http://localhost:3089/?hash=str-enc:...
```

The `hash` value is the JSON options object (for example `{"url":"https://example.com","width":600}`) encrypted with the same key using `@jmondi/string-encrypt-decrypt`. Without `CRYPTO_KEY`, requests that send a `hash` are rejected.

## Docker

```bash
docker build -t pagesnap .
docker run --rm -p 3089:3089 pagesnap
```

`docker compose up --build` starts the app together with CouchDB and MinIO for local testing.

## License

MIT, see [LICENSE](LICENSE).
