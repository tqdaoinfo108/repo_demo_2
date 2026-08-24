# OpenRouter AI proxy

GitHub Pages is a static website and cannot keep an API token private. This Worker calls OpenRouter server-side, while the browser only receives the public Worker URL.

1. Install and authenticate Wrangler: `npm install -g wrangler` then `wrangler login`.
2. In this directory, deploy once: `wrangler deploy`.
3. Add the token as a Worker secret (do not use a frontend variable): `wrangler secret put AI_TOKEN`.
4. Set the production site origin: `wrangler secret put ALLOWED_ORIGIN`, for example `https://<github-account>.github.io`.
5. In GitHub repository **Variables**, set `AI_PROXY_URL` to `https://<worker>.<account>.workers.dev`.

The deployed Worker accepts only POST and OPTIONS, limits conversation size, adds the product system prompt server-side, and does not expose `AI_TOKEN` to GitHub Pages.
