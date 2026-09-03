# NVIDIA Integrate AI proxy

GitHub Pages is a static website and cannot keep an API token private. This Worker calls an AI provider server-side, while the browser only receives the public Worker URL.

1. Install and authenticate Wrangler: `npm install -g wrangler` then `wrangler login`.
2. In this directory, deploy once: `wrangler deploy`.
3. Add the token as a Worker secret (do not use a frontend variable): `wrangler secret put AI_TOKEN`.
4. Set the production site origin: `wrangler secret put ALLOWED_ORIGIN`, for example `https://<github-account>.github.io`.
5. In GitHub repository **Variables**, set `AI_PROXY_URL` to `https://<worker>.<account>.workers.dev`.

The deployed Worker accepts only POST and OPTIONS, limits conversation size, adds the product system prompt server-side, and does not expose `AI_TOKEN` to GitHub Pages.

## Python alternative

`openrouter_proxy.py` is a dependency-free Python version for a VPS, Docker
container, or any backend runtime. It calls NVIDIA Integrate with
`google/gemma-4-31b-it`. The API key is assigned to `AI_TOKEN` at the top of
the file; never use `NEXT_PUBLIC_*` for it. Do not commit the file with a real
key.

```powershell
$env:ALLOWED_ORIGINS = "https://your-site.example"
$env:PORT = "8080"
python worker/openrouter_proxy.py
```

Set `NEXT_PUBLIC_AI_PROXY_URL` to its public base URL (or the full
`/v1/chat/completions` URL). The frontend never needs the provider key. Deploy
behind HTTPS and, for production usage, place the proxy behind an application
login and a shared rate limiter (the included limiter is local to one process).

## Deploy to Vercel

The `api/chat.py` function is a Vercel-ready version of the NVIDIA proxy.
When creating the Vercel project, set its **Root Directory** to `worker`.
The local `openrouter_proxy.py` is excluded from the Vercel upload.
Then add these Environment Variables in Vercel Project Settings:

- `AI_TOKEN`: the NVIDIA API key (mark it as Sensitive).
- `ALLOWED_ORIGINS`: comma-separated frontend origins, such as
  `https://your-account.github.io`.

Deploy from the repository. The public endpoint will be:

```text
https://<your-vercel-domain>/v1/chat/completions
```

Vercel detects Python files under `api/` as Python Functions, and
`vercel.json` rewrites the public OpenAI-compatible path to that function.
